const UserSchema = {
  name: 'User',
  primaryKey: 'email',
  properties: {
    name: 'string',
    email: 'string',
    username: { type: 'string', default: '' },
    access_token: 'string',
    date_modified: { type: 'date', default: new Date() },
  },
}

class User {}

User.schema = UserSchema

export default User
