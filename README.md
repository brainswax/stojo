# Stojo
Stojo is a simple plain old JavaScript object store.

This can be used to persist arbitrary JavaScript objects across application restarts or multiple applications. By default it uses sqlite3 to persist a named object to disk.

# Table of Contents
* [Instllation](#installation)
* [Usage](#usage)
* [Stojo Class](#stojo-class)
  * [new Stojo(options)](#new-stojooptions)
  * [init()](#init)
  * [store(name, object)](#storename-object)
  * [fetch(name)](#fetchname)
  * [close()](#close)


## Installation
```shell
npm install --save @codegrill/stojo
```

## Usage
```JavaScript
import { Stojo } from '@codegrill/stojo'

const stojo = new Stojo()
stojo.store('my.key', { foo: 'bar' })
  .then(() => stojo.fetch('my.key'))
  .then(o => console.log(JSON.stringify(o)))
  .then(() => stojo.close())
  .catch(err => console.error(err))
```
This should output:
```shell
{"foo":"bar"}
```

## Stojo Class

### new Stojo(options)
The constructor takes the following optional parameters:

* options ```<Object>```
  * db ```<Object>``` an existing sqlite3 or compatible database connection. If undefined, it will create a sqlite3 instance.
  * file ```<string>``` the database filename to open. Defaults to ./stojo.sqlite3.
  * logger ```<Object>``` a logger with the console interface. Defaults to console.
  * table ```<string>``` the create table command. Defaults to a table named stojo.
  * insert ```<string>``` the statement used to insert database rows. Defaults to a sqlite3 insert statement.
  * select ```<string>``` the query used to fetch a row from the database table

```JavaScript
import { Stojo } from '@codegrill/stojo'
import sqlite3 from 'sqlite3'
import logger from 'pino'

const stojo = new Stojo({
  db: new sqlite3.Database('./stojo.sqlite3'),
  logger: logger
})
```  

### init()
Added: v0.1.0

This will create the database table if it doesn't exist. It will only attempt to create the table once. Subsequent calls will be a no-op. A user is not required to ever call this and will get checked on any store or fetch command.

Returns a Promise to create the database table or no-op

### store(name, object)
Added: v0.1.0

Stores a named object in the store.

* name ```<string>``` the unique name of the named Object to store
* object ```<Object>``` the JavaScript Object to store

Returns a Promise to store the object

### fetch(name)
Added: v0.1.0

Fetches a named object from the store.

* name ```<string>``` the name of the Object to fetch from the store

Returns the JavaScript Object if it exists or null

### close()
Added: v0.1.0

Calls close on the db object

Returns a Promise to close the database connection
