import agent from 'superagent'
import RNFetchBlob from 'react-native-fetch-blob'
import Fetch from '../services/fetch'

const Media = {}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 *
 */
Media.request = async function (url) {
  try {
    const response = await new Fetch()
      .post('/media/explore')
      .send({ url })

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
Media.status = async function(id) {
  try {
    const response = await new Fetch()
      .get(`/media/status/${id}`)

    return response.body
  } catch(e) {
    throw e
  }
}

/**
 *
 */
Media.getSize = async function(url) {
  try {
    const response = await Media.sendHeadRequest(url)
    return ~~response.headers.get('content-length')
  } catch (e) {
    return null
  }
}

/**
 *
 */
Media.sendHeadRequest = async function(url, headers = {}) {
  try {
    return await agent
      .head(url)
      .timeout(5000)
      .set(headers)
  } catch (e) {
    return null
  }
}

/**
 *
 */
Media.canDirectDownload = async function(url) {
  const response = await Media.sendHeadRequest(url)

  if (!response) {
    return false
  }

  return response.status === 200
}

/**
 *
 */
Media.supportsByteRange = async function(url) {
  const headers = {
    Range: 'bytes=20-40'
  }

  const response = await Media.sendHeadRequest(url, headers)

  if (!response) {
    return false
  }

  return response.status === 206 ||
    response.headers['accept-ranges'] !== undefined ||
    response.headers['content-range'] !== undefined
}

/**
 *
 */
Media.getStartByte = async function (filepath) {
  try {
    const stat = await RNFetchBlob.fs.stat(filepath)
    return ~~stat.size
  } catch (e) {
    return 0
  }
}

/**
 *
 */
Media.getTypeByExtension = function (extension) {
  let type = 'document'

  const types = {
    music: ['mp3', 'aac', 'amr', 'wav', 'wma', 'ogg', 'm4a', 'opus'],
    video: ['mp4', 'webm', '3gp', 'mkv', 'flv', 'gif', 'avi', 'mov', 'wmv', 'mpg', 'mpeg', 'rmvb'],
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const tp in types) {
    if (types[tp].indexOf(extension) > -1) {
      type = tp
      break
    }
  }

  return type
}

/**
 *
 */
Media.dump = async function (id) {
  let counter = 0
  const retry = 11 // retry count
  const backoff = [0, 3, 5, 5, 9, 10, 15, 20, 30, 35, 50]

  let media
  let responseReceived = false

  // eslint-disable-next-line no-restricted-syntax
  do {
    await delay(backoff[counter] * 1000)

    // increase counter
    counter += 1

    try {
      media = await Media.status(id)
      responseReceived = media.status !== 'queued'
    } catch (e) {
      if (e && ~~e.status === 404) {
        throw e
      }
    }

  } while (counter < retry && !responseReceived)

  if (media.status === 'ready') {
    media.formats = media.formats || []
    media.type = Media.getTypeByExtension(media.extension)
    return media
  }

  throw media
}

export default Media
