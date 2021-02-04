import { addRxPlugin, createRxDatabase } from 'rxdb';
import IdbAdapter from 'pouchdb-adapter-indexeddb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBKeyCompressionPlugin } from 'rxdb/plugins/key-compression';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';

const sectionSchema = {
  keyCompression: true,
  version: 0,
  type: 'object',
  properties: {
    sectionTitle: {
      type: 'string',
    },
    lessons: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        properties: {
          lessonTitle: {
            type: 'string',
          },
          modules: {
            type: 'object',
            properties: {
              moduleTitle: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};

/* Initialize database and return Map of it's collections */
async function getDb() {
  addRxPlugin(IdbAdapter);
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBKeyCompressionPlugin);
  addRxPlugin(RxDBValidatePlugin);
  addRxPlugin(RxDBUpdatePlugin);
  addRxPlugin(RxDBJsonDumpPlugin);

  const db = await createRxDatabase({
    name: 'custnotedb',
    adapter: 'indexeddb',
    multiInstance: false,
    eventReduce: true,
  });

  const sectionsCollection = db.collection({
    name: 'sections',
    schema: sectionSchema,
    autoMigrate: true,
  });

  const collectionsMap = new Map();
  collectionsMap.set('sections', sectionsCollection);

  return collectionsMap;
}

/* Be sure to initialize only once to prevent database errors */
const collectionMap = getDb().then((collectionMap) => collectionMap);

/* Get collection from database finding with @collectionName parameter */
function getCollection(collectionName) {
  return collectionMap.then((collectionMap) => collectionMap.get(collectionName));
}

export default getCollection;
