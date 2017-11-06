import RNFetchBlob from 'react-native-fetch-blob'
import path from 'path'
import db from '../../database'
import store from '../../store'
import Media from '../../api/media'
import httpErrors from '../../utils/http-errors'
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
  .config({
    // addAndroidDownloads: {
    //   useDownloadManager: true,
    //   title: path.basename(filepath),
    //   description: `savevideobot - ${path.basename(filepath)}`,
    //   mediaScannable : true,
    //   notification : true,
    //   path: filepath,
    //   mime: 'video/mp4'
    // },
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
    done: false,
    resumable: resumable,
    start_byte: startByte,
    start_time: (new Date()).getTime()
  }))

  await Task
  .progress({ count: 100 }, (received, total) => {
    Downloader.onProgressChange(id, received, total, startByte)
  })
  .then(
    result => Downloader.onFinish(id, result),
    error => Downloader.onFail(id, error)
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
}

/**
 *
 */
Downloader.onFinish = async function(id, result) {
  const task = Downloader.getTask(id)
  const { status } = result.info()

  if ([200, 202, 205, 206].indexOf(status) === -1) {
    let errorMessage = httpErrors[status] || 'Can not download file'
    return Downloader.onFail(id, { message:  `Server error: ${errorMessage}`})
  }

  const receivedBytes = await Media.getStartByte(result.path())
  const downloadedPercent = (100 * receivedBytes) / task.total
  const isCompleted = downloadedPercent > 99

  // because RNFetchBlob sucks on download cancelation, I check percentage once
  // to ensure file is downloaded completely or not
  if (!isCompleted) {
    return Downloader.onFail(id, {
      message: `Download is ${task.resumable ? 'paused' : 'not completed'}`
    })
  }

  // update in database
  db.save('Media', {
    id,
    size: task.total,
    status: 'complete',
    filepath: result.path(),
    date_modified: new Date()
  }, true)

  // update task
  store.dispatch(updateProgress(id, {
    received: task.total,
    active: false,
    done: true
  }))

  // clear task after 5 seconds
  setTimeout(() => Downloader.clearTask(id), 60000)
}

/*
 * return download path based on platform
 */
Downloader.getDownloadPath = async function() {
  let downloadPath
  const dirs = RNFetchBlob.fs.dirs

  const setting = db.find('Setting').filtered('name = "download-path"')

  if (setting.length === 1) {
    downloadPath = dirs[setting[0]]
  }

  if (!downloadPath) {
    downloadPath = dirs.DownloadDir
  }

  // create full download path
  const fullDownloadPath = `${downloadPath}/savevideobot`

  const isDir = await RNFetchBlob.fs.isDir(fullDownloadPath)

  if (!isDir) {
    await RNFetchBlob.fs.mkdir(fullDownloadPath)
  }

  return fullDownloadPath
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
Downloader.getTask = function(id) {
  const { progress } = store.getState()
  return progress[id]
}

export default Downloader
