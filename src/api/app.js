import Fetch from '../services/fetch'
const App = {}

/**
 *
 */
App.versionControl = async function () {
  try {
    const response = await new Fetch()
      .get('/client/version')

    return response
  } catch(e) {
    throw e
  }
}

export default App
