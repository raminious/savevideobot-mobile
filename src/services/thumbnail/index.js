import { Image } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import Path from 'path'
import uri from 'url'

const defaultThumbnails = {
  music: require('../../assets/thumbs/music.jpg'), // eslint-disable-line global-require
  video: require('../../assets/thumbs/video.jpg'), // eslint-disable-line global-require
  document: require('../../assets/thumbs/document.jpg') // eslint-disable-line global-require
}

/*
 * get media thumbnail, check url is blocked or not
 * if blocked, use thumbnailProxy url instead
 * if media has not any thumbnail use default thumbnails
 */
const getInfo = async function (media) {
  if (!media.thumbnail) {
    if (media.type === 'image') {
      return {
        url: media.download,
        filename: Path.basename(uri.parse(media.download).pathname)
      }
    } else {
      return {
        isDefault: true,
        path: getMediaDefultThumbnail(media.type)
      }
    }
  }

  let url = null
  const thumbnails = [media.thumbnailProxy, media.thumbnail]

  for (const thumb of thumbnails) {
    try {
      await Image.prefetch(thumb)
      url = thumb
      break
    } catch (e) { /* nothing */ }
  }

  if (url === null) {
    return {
      isDefault: true,
      path: getMediaDefultThumbnail(media.type)
    }
  }

  // get filename based on url
  const filename = Path.basename(uri.parse(media.thumbnail).pathname)

  return {
    url,
    filename
  }
}

/**
 *  return default thumbnail based on file type
 */
const getMediaDefultThumbnail = function (type) {
  return defaultThumbnails[type]
}

/*
 * get thumbnail
 */
const fetchImageFromInternet = (thumbnail) => {
  if (thumbnail.isDefault) {
    return thumbnail.path
  }

  return {
    uri: thumbnail.url
  }
}

/*
 *
 */
const loadImage = (media) => {
  if (!media.thumbnail) {
    return getMediaDefultThumbnail(media.type)
  }

  return {
    // eslint-disable-next-line prefer-template
    uri: 'file://' + RNFetchBlob.fs.dirs.DocumentDir + '/thumbnails/' + media.thumbnail
  }
}

/*
 * save media thumbnail on disk
 */
const saveOnDisk = async (id, thumbnail, prefix) => {
  if (!thumbnail || thumbnail.isDefault) {
    return null
  }

  const destination = (prefix + thumbnail.filename)
    .replace(/[&/\\#,+()$~%'":*?<>{}\s+]/g, '')
    .toLowerCase()

  const isExists = await RNFetchBlob.fs.exists(destination)

  if (isExists) {
    return {
      id,
      path: destination
    }
  }

  // download path
  const path = `${await getBasePath()}/${destination}`

  const fs = RNFetchBlob
  .config({
    fileCache: true,
    path
  })

  try {
    await fs.fetch('GET', thumbnail.url, {})

    // check is downloaded correct or not
    const stat = await RNFetchBlob.fs.stat(path)

    if (stat.size < 500) {
      RNFetchBlob.fs.unlink(path).then(r => r).catch(e => e)
      return {
        id,
        path: ''
      }
    }

    return {
      id,
      path: destination
    }
  } catch (e) { /* nothing */ }

  return null
}

/*
 * return thumbnails path based on platform
 */
const getBasePath = async () => {
  const base = `${RNFetchBlob.fs.dirs.DocumentDir}/thumbnails`
  const isDir = await RNFetchBlob.fs.isDir(base)

  if (!isDir)  {
    await RNFetchBlob.fs.mkdir(base)
  }

  return base
}

export default {
  getBasePath,
  getInfo,
  fetchImageFromInternet,
  loadImage,
  saveOnDisk
}
