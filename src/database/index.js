import Realm from 'realm'

// load models
import Media from './media'
import User from './user'
import Setting from './setting'

const realm = new Realm({
  schema: [Media, User, Setting],
  schemaVersion: 4,
})

/*
 * save/update object in database
 */
const save = function (schema, attributes, update) {
  try {
    realm.write(() => {
      realm.create(schema, attributes, update || false)
    })
  } catch (e) {
    console.warn(e, schema, attributes) // eslint-disable-line no-console
  }
}

/*
 * remove objects from database
 */
const remove = function (objects) {
  try {
    realm.write(() => {
      if (objects.length > 0) realm.delete(objects)
    })
  } catch (e) {
    console.warn(e) // eslint-disable-line no-console
  }
}

module.exports = {
  instance: realm,
  find: schema => realm.objects(schema),
  save,
  remove
}
