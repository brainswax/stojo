/* eslint-env jest */
import * as stojo from '../lib/index.mjs'
import fs from 'fs'
import _ from 'lodash'
import assert from 'assert'

describe('Stojo', () => {
  const file = './stojo.test.sqlite3'
  if (fs.existsSync(file)) fs.unlinkSync(file)

  const store = new stojo.Stojo({ file: file })
  const key = 'test.foo'
  const object = { foo: 'foo' }
  const notakey = 'not.an.object'
  const nullkey = 'null'

  describe('init', () => {
    it('can initialize', () => {
      return store.init()
    })
  })

  describe('store', () => {
    it('can store an object', async () => {
      return store.store(key, object)
    })

    it('can store a null object', async () => {
      return store.store(nullkey, null)
    })
  })

  describe('fetch', () => {
    it('can fetch a stored object', async () => {
      return store.fetch(key)
        .then(data => {
          assert.ok(_.isEqual(data, object))
        })
    })

    it('can fetch a null object', async () => {
      return store.fetch(nullkey)
        .then(data => {
          assert.equal(data, null)
        })
    })

    it('can handle fetching an object that doesn\'t exist', async () => {
      return store.fetch(notakey)
        .then(data => {
          assert.equal(data, null)
        })
    })
  })

  describe('close', () => {
    it('can close the database connection', () => {
      return store.close()
    })
  })
})
