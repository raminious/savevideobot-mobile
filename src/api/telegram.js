import Fetch from '../services/fetch'
import agent from 'superagent'
import moment from 'moment'
const Telegram = {}

/**
 *
 */
Telegram.sendCommand = async function(telegram_id, text) {
  try {
    const response = await new Fetch({ server: 'telegram' })
      .post('/')
      .send({
        update_id: moment().format('x'),
        message: {
          message_id: telegram_id,
          from: {
            id: telegram_id
          },
          chat: {
            id: telegram_id,
            type: 'private'
          },
          date: moment().format('x'),
          text
        }
      })

    return response.body
  } catch(e) {
    console.log(e.response)
    throw e
  }
}

export default Telegram
