import { ObjectId } from 'bson'
import { Db, MongoClient } from 'mongodb'
import * as mongoUri from 'mongodb-uri'

let db: Db
let client: MongoClient

export const getTestDb: () => Db = () => {
  if (!db) throw new Error('Test database not yet initialized!')
  return db
}

export const getTestDbClient: () => MongoClient = () => {
  if (!client) throw new Error('Test database not yet initialized!')
  return client
}

export const initializeTestDB = async (uri: string): Promise<void> => {
  if (db) return
  const { database } = mongoUri.parse(uri)
  client = await MongoClient.connect(uri, { useNewUrlParser: true, j: true, w: 1, useUnifiedTopology: true })
  db = client.db(database)
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  signals.forEach(s => process.once(s, async () => await client.close()))
}

/**
 * Will empty out the database without dropping it
 */
export const removeCollections = async () => {
  const collections = await getTestDb().collections()
  await Promise.all(collections.map(c => c.drop()))
}

/**
 * Will close connection to DB
 */
export const closeDb = () => getTestDbClient().close()

/**
 * Will fill the given collection name with the given data
 */
export const fillCollection = (collectionName: string, docs: object[]) => {
  return getTestDb().collection(collectionName).insertMany(docs)
}

/**
 * Will take a snapshot of the given collection
 */
export const getCollectionSnapshot = async ({
  collectionName,
  removeIds,
}: {
  collectionName: string
  removeIds?: boolean
}) => {
  const res = await getTestDb().collection(collectionName).find().toArray()

  if (removeIds) {
    return res.map(record => {
      const { _id, ...rest } = record
      return rest
    })
  }
  return res
}
/**
 * Will take a snapshot of a selected object in a collection
 */
export const getObjectSnapshot = async ({
  collectionName,
  id,
  removeIds,
}: {
  collectionName: string
  id: ObjectId
  removeIds?: boolean
}) => {
  const res = await getTestDb().collection(collectionName).findOne({ _id: id })

  if (!res) return

  if (removeIds) {
    const { _id, ...rest } = res
    return rest
  }
  return res
}

/**
 * It will update a given object in the given collection
 */
export const updateObjInCollection = async ({
  collectionName,
  id,
  update,
}: {
  collectionName: string
  id: ObjectId
  update: object
}) => {
  return getTestDb().collection(collectionName).updateOne({ _id: id }, { $set: update })
}

/**
 * Drops the DB
 */
export const flushDb = () => getTestDb().dropDatabase()
