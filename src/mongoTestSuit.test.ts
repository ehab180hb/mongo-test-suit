import {
  initializeTestDB,
  getTestDb,
  getTestDbClient,
  getCollectionSnapshot,
  removeCollections,
  getObjectSnapshot,
  fillCollection,
  flushDb,
  closeDb,
  updateObjInCollection,
} from '.'
import * as randomString from 'randomstring'
import { ObjectId } from 'mongodb'

const dbName = `mongo-test-suit-db-${randomString.generate(7)}`
const uri = `mongodb://localhost/${dbName}`

beforeAll(async () => {
  await initializeTestDB(uri)
})

afterAll(async () => {
  await flushDb()
  await closeDb()
})

describe('getTestDb()', () => {
  test('Gets test database', async () => {
    expect(await getTestDb().stats()).toMatchInlineSnapshot(`
      Object {
        "avgObjSize": 0,
        "collections": 0,
        "dataSize": 0,
        "db": "${dbName}",
        "fileSize": 0,
        "fsTotalSize": 0,
        "fsUsedSize": 0,
        "indexSize": 0,
        "indexes": 0,
        "numExtents": 0,
        "objects": 0,
        "ok": 1,
        "scaleFactor": 1,
        "storageSize": 0,
        "views": 0,
      }
    `)
  })
})

describe('getTestDbClient()', () => {
  test('Properly gets the client', async () => {
    expect(await getTestDbClient().getMaxListeners()).toBe(10)
  })
})

describe('removeCollections()', () => {
  test('Properly removes all collections', async () => {
    const newCollectionsNames = ['c1', 'c2']
    await Promise.all(
      newCollectionsNames.map(collectionName =>
        getTestDb()
          .collection(collectionName)
          .insertOne({ _id: new ObjectId('5ea17b9575fd19491a3a9e90'), k: 'v' }),
      ),
    )
    await removeCollections()
    expect(await getTestDb().collections()).toEqual([])
  })
})

describe('fillCollection()', () => {
  const collectionName = 'testCollection'
  const testObj = { _id: new ObjectId('5ea17b9575fd19491a3a9e90'), k: 'v' }
  afterAll(async () => {
    await getTestDb().collection(collectionName).drop()
  })
  test('Properly fills the collection', async () => {
    await fillCollection(collectionName, [testObj])
    expect(await getTestDb().collection(collectionName).findOne({ _id: testObj._id })).toMatchSnapshot()
  })
})

describe('getCollectionSnapshot()', () => {
  const collectionName = 'testCollection'
  const testObj = { _id: new ObjectId('5ea17b9575fd19491a3a9e90'), k: 'v' }
  beforeAll(async () => {
    await getTestDb().collection(collectionName).insertOne(testObj)
  })
  afterAll(async () => {
    await getTestDb().collection(collectionName).drop()
  })
  test('Gets a snapshot of the collections without the IDs', async () => {
    expect(await getCollectionSnapshot({ collectionName, removeIds: true })).toMatchSnapshot()
  })
  test('Gets a snapshot of the collections with the IDs', async () => {
    expect(await getCollectionSnapshot({ collectionName })).toMatchSnapshot()
  })
})

describe('getObjectSnapshot()', () => {
  const collectionName = 'testCollection'
  const testObj = { _id: new ObjectId('5ea17b9575fd19491a3a9e90'), k: 'v' }
  beforeAll(async () => {
    await getTestDb().collection(collectionName).insertOne(testObj)
  })
  afterAll(async () => {
    await getTestDb().collection(collectionName).drop()
  })
  test('When getting the object without the IDs', async () => {
    expect(await getObjectSnapshot({ collectionName, id: testObj._id, removeIds: true })).toMatchSnapshot()
  })
  test('When getting the object with the IDs', async () => {
    expect(await getObjectSnapshot({ collectionName, id: testObj._id })).toMatchSnapshot()
  })
})

describe('updateObjInCollection()', () => {
  const collectionName = 'testCollection'
  const testObj = { _id: new ObjectId('5ea17b9575fd19491a3a9e90'), k: 'oldValue' }

  beforeAll(async () => {
    await getTestDb().collection(collectionName).insertOne(testObj)
  })
  afterAll(async () => {
    await getTestDb().collection(collectionName).drop()
  })

  test('Properly updates the object', async () => {
    await updateObjInCollection({ collectionName, id: testObj._id, update: { k: 'newValue' } })
    expect(await getTestDb().collection(collectionName).findOne({ _id: testObj._id })).toMatchSnapshot()
  })
})
