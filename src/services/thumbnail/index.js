import { Image } from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
import Path from 'path'
import uri from 'url'

const wallpapers = {
  music: require('../../assets/wallpapers/music.jpg'), // eslint-disable-line global-require
  video: require('../../assets/wallpapers/video.jpg'), // eslint-disable-line global-require
  document: require('../../assets/wallpapers/document.jpg') // eslint-disable-line global-require
}

/*
 * get media thumbnail, check url is blocked or not
 * if blocked, use thumbnailProxy url instead
 * if media has not any thumbnail use default thumbnails
 */
const getInfo = async function (media) {
  if (!media.thumbnail) {
    return null
  }

  const thumbnails = [media.thumbnail, media.thumbnailProxy]
  let url = null

  for (const thumb of thumbnails) {
    try {
      await Image.prefetch(thumb)
      url = thumb
      break
    } catch (e) { /* nothing */ }
  }

  if (url === null) {
    return null
  }

  // get filename based on url
  const filename = Path.basename(uri.parse(media.thumbnail).pathname)

  return {
    url,
    filename
  }
}

/**
 *  return wallpaper based on file type
 */
const getMediaWallpaper = function (type) {
  return wallpapers[type]
}

/*
 * get thumbnail
 */
const fetchImageFromInternet = (thumbnail) => {
  // if (thumbnail.isWallpaper) {
  //   return thumbnail.path
  // }

  return {
    uri: thumbnail.url
  }
}

/*
 *
 */
const loadImage = (media) => {
  if (!media.thumbnail) {
    return getMediaWallpaper(media.type)
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
  // if (thumbnail.isWallpaper) {
  //   return null
  // }

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
