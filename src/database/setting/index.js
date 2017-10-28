const SettingSchema = {
  name: 'Setting',
  primaryKey: 'name',
  properties: {
    name: 'string',
    value: 'string'
  }
}

class Setting {}

Setting.schema = SettingSchema

export default Setting
