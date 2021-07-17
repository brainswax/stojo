/* eslint-env jest */
import * as stojo from '../lib/Stojo.mjs'
import fs from 'fs'

describe('Test the store functionality', () => {
  const file = './stojo.test.sqlite3'
  if (fs.existsSync(file)) fs.unlinkSync(file)

  const db = new stojo.Stojo({ file: file })

  it('can store and retrieve an object', async () => {
    return db.init()
      .then(() => db.store('test.foo', { foo: 'foo' }))
      .then(() => db.fetch('test.foo'))
      .then((data) => {
        expect(data).toBeDefined()
        expect(data.foo).toBeDefined()
        expect(data.foo).toBe('foo')
      })
      .then(() => db.close())
  })
})
