import sqlite3 from 'sqlite3'

/**
A database run command wrapped in a Promise.
@param db an instance of a sqlite3 or compatible database
@param statement the SQL statement to perform
@param params any paramaterized variables to replace in the statement
@return a promise to perform the statement and return the result as an object
*/
async function run (db, statement, params = []) {
  return new Promise((resolve, reject) => {
    db.run(statement, params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

/**
A database get command wrapped in a Promise.
@param db an instance of a sqlite3 or compatible database
@param query the SQL query to perform
@param params any paramaterized variables to replace in the query
@return a promise to perform the query and return the result as an object
*/
async function get (db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, data) => {
      if (err) reject(err)
      else resolve(data ? JSON.parse(data.value) : null)
    })
  })
}

/**
Stojo is a simple plain old JavaScript object store.

It is a basic key:value (name:object) object store, which uses sqlite3 by default.
You can store an arbitrary JavaScript object by speficying a name and the object.
The named Object can then be retrieved later with a fetch.
*/
class Stojo {
  constructor (opts = {}) {
    this.logger = opts.logger || console
    this.initialized = false

    const file = opts.file || './stojo.sqlite3'
    this.db = opts.db || new sqlite3.Database(file, (err) => {
      if (err) this.logger.warn(`Could not connect to database '${file}'`)
    })

    this.table = opts.table || `
      CREATE TABLE IF NOT EXISTS stojo (
        name TEXT PRIMARY KEY,
        value BLOB NOT NULL,
        time DATETIME DEFAULT CURRENT_TIMESTAMP)`
    this.insert = opts.insert || 'INSERT OR REPLACE INTO stojo (name, value) VALUES (?, ?)'
    this.select = opts.select || 'SELECT * FROM stojo WHERE name = ?'
  }

  /**
  Ensure that the table is created for the database. This is meant to be called on every operation
  so the user of this class doesn't have to care about when to create the database table.
  @return a promise to create the database table
  */
  async init () {
    if (!this.initialized) {
      this.initialized = true
      return run(this.db, this.table)
    }
  }

  /**
  Stores a named object in the database
  @param name a unique name to identify the object in the database
  @param object the object being persisted
  @return a promise to store the object
  */
  async store (name, object) {
    return this.init()
      .then(() => run(this.db, this.insert, [name, JSON.stringify(object)]))
  }

  /**
  Fetch a named object from the database
  @param name a unique name to identify the object in the database
  @return a promise to retrieve it as an object
  */
  async fetch (name) {
    return this.init()
      .then(() => get(this.db, this.select, [name]))
  }

  /**
  Close the database connection
  @return a promise to close the database connection
  */
  async close () {
    return this.db.close()
  }
}

export { Stojo }
