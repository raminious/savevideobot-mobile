const MediaSchema = {
  name: 'Media',
  primaryKey: 'id',
  properties: {
    id: 'string',
    favorite: { type: 'bool', default: false, indexed: true },
    site: { type: 'string', default: '' },
    url: 'string',
    download_link: 'string',
    title: { type: 'string', indexed: true },
    extension: 'string',
    type: { type: 'string', default: 'document', indexed: true },
    filename: 'string',
    thumbnail: { type: 'string', default: '' },
    status: { type: 'string', default: '', indexed: true },
    size: { type: 'int', optional: true, default: 0 },
    duration: { type: 'int', optional: true, default: 0 },
    format: { type: 'string', default: 'best' },
    resumable: { type: 'bool', optional: true },
    filepath: { type: 'string', default: '' },
    directory: { type: 'string', default: 'home' },
    date_created: { type: 'date', default: new Date() },
    date_modified: { type: 'date', default: new Date() },
  }
}

class Media {}

Media.schema = MediaSchema

export default Media
