import Fetch from '../services/fetch'
import agent from 'superagent'
const Community = {}

/**
 *
 */
Community.live = async function () {
  try {
    // const response = await new Fetch()
    //   .get('/media/live')
    const response = await agent.get('https://savevideobot.com/api/media/live')
    return response.body
  } catch(e) {
    return null
  }
}

export default Community
