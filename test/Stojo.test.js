/* eslint-env jest */
import * as stojo from '../lib/index.mjs'
import fs from 'fs'
import _ from 'lodash'

describe('Stojo', () => {
  const file = './stojo.test.sqlite3'
  if (fs.existsSync(file)) fs.unlinkSync(file)

  const store = new stojo.Stojo({ file: file })
  const key = 'test.foo'
  const object = { foo: 'foo' }
  const notakey = 'not.an.object'
  const nullkey = 'null'

  it('can store an object', async () => {
    return store.store(key, object)
  })

  it('can fetch the stored object', async () => {
    return store.fetch(key)
      .then(data => {
        expect(_.isEqual(data, object)).toBe(true)
      })
  })

  it('can handle fetching an object that doesn\'t exist', async () => {
    return store.fetch(notakey)
      .then(data => {
        expect(data).toBe(null)
      })
  })

  it('can store a null object', async () => {
    return store.store(nullkey, null)
  })

  it('can fetch a null object', async () => {
    return store.fetch(nullkey)
      .then(data => {
        expect(data).toBe(null)
      })
  })
})
