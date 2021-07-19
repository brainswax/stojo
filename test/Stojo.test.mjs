/* eslint-env mocha */
import { Stojo } from '../lib/index.mjs'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import _ from 'lodash'
import assert from 'assert'
import { expect } from 'chai'

class ErrorDB {
  constructor (options = {}) { this.options = options }

  async init () {
  }

  async run (statement, params = [], callback) {
    return callback(new Error('error executing a statement'))
  }

  get (query, params = [], callback) {
    return callback(new Error('error querying the database'))
  }

  async close () {
    return new Promise((resolve, reject) => {
      reject(new Error('error closing the database connection'))
    })
  }
}

describe('Stojo', () => {
  const file = './stojo.test.sqlite3'
  if (fs.existsSync(file)) fs.unlinkSync(file)

  let store = null
  let errorStore = null

  const key = 'test.foo'
  const object = { foo: 'foo' }
  const notakey = 'not.an.object'
  const nullkey = 'null'

  describe('instantiate', () => {
    it('should instantiate with no options', async () => {
      const noOptsStore = new Stojo()
      expect(noOptsStore).to.not.equal(null)
    })

    it('should instantiate with an existing sqlite3 database', async () => {
      const dbStore = new Stojo({
        db: new sqlite3.Database('./stojo.test.sqlite3')
      })
      expect(dbStore).to.not.equal(null)
    })

    it('should instantiate with file name', async () => {
      store = new Stojo({ file: file })
      expect(store).to.not.equal(null)
    })

    it('should instantiate with a non-sqlite3 database', async () => {
      errorStore = new Stojo({ db: new ErrorDB() })
      expect(errorStore).to.not.equal(null)
    })
  })

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

    it('can handle a rejected store', async () => {
      return errorStore.store('key', {})
        .then(() => assert(false, 'the store should have throw an error'))
        .catch(e => expect(e).to.be.an('error'))
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

    it('can handle a rejected fetch', async () => {
      return errorStore.fetch('key')
        .then(() => assert(false, 'the fetch should have throw an error'))
        .catch(e => expect(e).to.be.an('error'))
    })
  })

  describe('close', () => {
    it('can close the database connection', () => {
      return store.close()
    })

    it('can handle a rejected close', async () => {
      return errorStore.close()
        .then(() => assert(false, 'the close should have throw an error'))
        .catch(e => expect(e).to.be.an('error'))
    })
  })
})
