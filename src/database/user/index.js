const UserSchema = {
  name: 'User',
  primaryKey: 'email',
  properties: {
    id: 'string',
    name: 'string',
    email: 'string',
    username: { type: 'string', default: '' },
    telegram_id: { type: 'string', optional: true, default: null },
    telegram_bot: { type: 'string', optional: true, default: null },
    access_token: 'string',
    date_modified: { type: 'date', default: new Date() },
  },
}

class User {}

User.schema = UserSchema

export default User
