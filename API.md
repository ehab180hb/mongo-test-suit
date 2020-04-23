### `initializeTestDB(uri)`

Will initialize the DB connection and allow you to use the rest of the functions.

- `uri` - the MongoDB connection string

```typescript
await initializeTestDB('mongodb://localhost/my-db')
```

### `getTestDb()`

Will get the native MongoDB driver's `Db` object and throws if the database was not initialized through the `initializeTestDB` function.

```typescript
const { db: dbName } = await getTestDb().stats()
```

### `getTestDbClient()`

Will get the native MongoDB driver's `MongoClient` object and throws if the database was not initialized through the `initializeTestDB` function.

```typescript
const maxListeners = await getTestDbClient().getMaxListeners()
```

### `removeCollections()`

Will empty out the database without dropping it

### `closeDb()`

Closes the initialized DB connection

### `fillCollection(collectionName, docs)`

Will fill the collection with the given array of documents.

- `collectionName` - The name of the collection
- `docs` - The array of objects to insert

```typescript
await fillCollection('MyCollection', [{ k: 'v' }, { k: 'v2' }])
```

### `getCollectionSnapshot({ collectionName, removeIds })`

Will capture a snapshot of the given collection name.

- `collectionName` - The name of the collection
- `removeIds` - Optional. Whether or not to rome the \_id field on returned objects. Useful when the IDs are generating dynamically and you're using Jest's `toMatchSnapshot` method to assert.

```typescript
expect(await getCollectionSnapshot({ collectionName: 'MyCollection', removeIds: true })).toMatchSnapshot()
```

### `getObjectSnapshot({ collectionName, id, removeIds })`

Captures a snapshot of the object.

- `collectionName` - The name of the collection
- `id` - the ObjectId of the db record.
- `removeIds` - Optional. Whether or not to rome the \_id field on returned objects. Useful when the IDs are generating dynamically and you're using Jest's `toMatchSnapshot` method to assert.

```typescript
expect(
  await getCollectionSnapshot({
    collectionName: 'MyCollection',
    id: new ObjectId('5ea1dd789f51b08e93850ae9'),
    removeIds: true,
  }),
).toMatchSnapshot()
```

### `updateObjInCollection({ collectionName, id, update })`

Will set the fields of the object.

- `collectionName` - The name of the collection
- `id` - the ObjectId of the db record.
- `update` - The fields to update

```typescript
await updateObjInCollection({
  collectionName: 'MyCollection',
  id: new ObjectId('5ea1dd789f51b08e93850ae9'),
  update: { createdAt: new Date() },
})
```

### `flushDb()`

Will drop the test DB.

- `value` - the value to validate.

```typescript
afterAll(async () => {
  await flushDb()
})
```
