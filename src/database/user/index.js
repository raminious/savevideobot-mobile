const UserSchema = {
  name: 'User',
  primaryKey: 'email',
  properties: {
    id: 'string',
    name: 'string',
    email: 'string',
    email_confirmed: { type: 'bool', default: false },
    telegram_id: { type: 'string', optional: true, default: null },
    access_token: 'string',
    subscription: { type: 'string', default: null },
    date_modified: { type: 'date', default: new Date() }
  }
}

class User {}

User.schema = UserSchema

export default User
