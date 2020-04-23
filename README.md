A set of helper utility functions that makes testing MongoDB-based projects quick, nimble and readable. Written in Typescript.

# Installation

[![NPM Info](https://nodei.co/npm/mongo-test-suit.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/mongo-test-suit)

[![Build Status](https://travis-ci.org/ehab180hb/mongo-test-suit.svg?branch=master)](https://travis-ci.org/ehab180hb/mongo-test-suit)

## Example usage

```typescript
import { initializeTestDB, getCollectionSnapshot, flushDb, closeDb } from 'mongo-test-suit'
import * as randomString from 'randomstring'
import { ObjectId } from 'mongodb'

const dbName = `my-db-${randomString.generate(7)}`
const uri = `mongodb://localhost/${dbName}`

beforeAll(async () => {
  await initializeTestDB(uri)
})

afterAll(async () => {
  await flushDb()
  await closeDb()
})

describe('myNeatFunction()', () => {
  test('It does what you think it does', async () => {
    // Go about your business
    // Now get a snapshot of the collection
    expect(await getCollectionSnapshot({ collectionName: 'MyCollection' })).toMatchSnapshot()
  })
})
```

Full API documentation [here](https://github.com/ehab180hb/mongo-test-suit/blob/master/API.md)

## Author

[Ehab Khaireldin](https://github.com/ehab180hb)

## License

This project is licensed under the MIT License
