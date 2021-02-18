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
          lessonId: {
            type: 'string',
          },
        },
      },
    },
  },
};

const moduleSchema = {
  keyCompression: true,
  version: 0,
  type: 'object',
  properties: {
    lessonId: {
      type: 'string',
      primary: true,
    },
    modules: {
      type: 'array',
      default: [],
      items: {
        type: 'object',
        properties: {
          moduleTitle: {
            type: 'string',
          },
          subjects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                subjectTitle: {
                  type: 'string',
                },
                content: {
                  type: 'string',
                },
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

  await db.addCollections({
    sections: {
      schema: sectionSchema,
      autoMigrate: true,
    },
    modules: {
      schema: moduleSchema,
      autoMigrate: true,
    },
  });

  const collectionsMap = new Map();
  collectionsMap.set('sections', db.sections);
  collectionsMap.set('modules', db.modules);

  return collectionsMap;
}

/* Be sure to initialize only once to prevent database errors */
const collectionMap = getDb().then((collectionMap) => collectionMap);

/* Get collection from database finding with @collectionName parameter */
function getCollection(collectionName) {
  return collectionMap.then((collectionMap) => collectionMap.get(collectionName));
}

export default getCollection;
