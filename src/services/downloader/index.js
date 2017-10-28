import RNFetchBlob from 'react-native-fetch-blob'
import path from 'path'
import db from '../../database'
import store from '../../store'
import { addProgress, updateProgress, removeProgress } from '../../actions/progress'

const Downloader = {}

/**
 *
 */
Downloader.createTask = async function(id, downloadLink, filepath, resumable, startByte = 0) {
  // add progress
  store.dispatch(addProgress(id, path.basename(filepath)))

  // set headers
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  }

  if (startByte > 0) {
    headers.Range = `bytes=${startByte}-`
    // headers['Transfer-Encoding'] = 'Chunked'
  }

  const Task = new RNFetchBlob
  .config({ // eslint-disable-line new-cap
    addAdnroidDownloads: {
      useDownloadManager: true,
      notification: true,
      description: `savevideobot - ${path.basename(filepath)}`,
      mediaScannable: true,
    },
    timeout: 15000,
    overwrite: startByte === 0,
    fileCache: true,
    path: filepath
  })
  .fetch('GET', downloadLink, headers)

  // update task
  store.dispatch(updateProgress(id, {
    Task,
    link: downloadLink,
    filepath: filepath,
    active: true,
    start_byte: startByte,
    start_time: (new Date()).getTime()
  }))

  await Task
  .progress({ interval: 1000 }, (received, total) => {
    Downloader.onProgressChange(id, received, total, startByte)
  })
  .then(
    result => this.onFinish(id, result),
    error => this.onFail(id, error)
  )
}

/**
 *
 */
Downloader.onProgressChange = function(id, received, total, startByte) {
  store.dispatch(updateProgress(id, {
    received: ~~received + startByte,
    total: ~~total + startByte
  }))
}

/**
 *
 */
Downloader.onFail = function(id, error) {
  if (error.message === 'cancelled') {
    return false
  }

  // update task
  store.dispatch(updateProgress(id, {
    error: error.message,
    active: false
  }))

  setTimeout(() => {
    Downloader.removeTask(id)
  }, 3000)
}

/**
 *
 */
Downloader.onFinish = function(id, result) {
  const totalSize = Downloader.getTotalSize(id)
  const { status } = result.info()

  if (status >= 400) {
    return Downloader.onFail(id, { message: 'Can not download file' })
  }

  // update in database
  db.save('Media', {
    id,
    size: totalSize,
    status: 'complete',
    filepath: result.path(),
    date_modified: new Date()
  }, true)

  // update task
  store.dispatch(updateProgress(id, {
    received: totalSize,
    active: false,
    done: true
  }))

  // clear task after 5 seconds
  setTimeout(() => Downloader.clearTask(id), 5000)
}

/**
 *
 */
Downloader.removeTask = function(id) {
  const task = Downloader.getTask(id)

  // remove from db
  db.remove(db.find('Media').filtered('id = $0', id))

  // remove from disk
  RNFetchBlob
  .fs
  .unlink(task.filepath)
  .then(r => r, e => e)

  // remove task from reducer
  Downloader.clearTask(id)
}

/**
 *
 */
Downloader.clearTask = function(id) {
  // clear task from reducer
  store.dispatch(removeProgress(id))
}

/**
 *
 */
Downloader.stopTask = function(id) {
  const task = Downloader.getTask(id)

  // stop worker
  task.Task.cancel()

  // update task
  store.dispatch(updateProgress(id, {
    active: false,
    isCanceled: true
  }))
}

/**
 *
 */
Downloader.resumeTask = async function(id) {
  const { link, filepath, resumable } = Downloader.getTask(id)
  const startByte = resumable ? await Media.getStartByte(filepath) : 0

  store.dispatch(updateProgress(id, {
    isCanceled: false
  }))

  Downloader.createTask(id, link, filepath, resumable, startByte)
}

/**
 *
 */
Downloader.getTotalSize = function(id) {
  const task = Downloader.getTask(id)
  return ~~task.total
}

/**
 *
 */
Downloader.getTask = function(id) {
  const { progress } = store.getState()
  return progress[id]
}

export default Downloader
