import IdbAdapter from 'pouchdb-adapter-indexeddb';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBKeyCompressionPlugin } from 'rxdb/plugins/key-compression';
import { RxDBValidateZSchemaPlugin } from 'rxdb/plugins/validate-z-schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import router from '../router/index';

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
        type: ['object', 'null'],
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

const subjectSchema = {
  keyCompression: true,
  version: 0,
  type: 'object',
  properties: {
    lessonId: {
      type: 'string',
      primary: true,
    },
    subjects: {
      type: 'array',
      default: [],
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
};

/* Create database with all collections */
async function createDb() {
  addRxPlugin(IdbAdapter);
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBKeyCompressionPlugin);
  addRxPlugin(RxDBValidateZSchemaPlugin);
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
    subjects: {
      schema: subjectSchema,
      autoMigrate: true,
    },
  });

  return db;
}

/* Initialize only once to prevent database errors */
const db = createDb().then((db) => db);

/* Export database to JSON */
async function exportDb() {
  return db.then((db) => db.dump());
}

/* Get present db then clear all collections then import backup */
function importDb(jsonDb) {
  db.then((db) => {
    db.remove()
      .then(() => createDb()
        .then((db) => {
          db.importDump(jsonDb)
            .then(() => {
              router().push('/')
                .then(() => window.location.reload());
            });
        }));
  });
}

/* Get collection from database with @collectionName parameter */
function getCollection(collectionName) {
  return db.then((db) => db[collectionName]);
}

export {
  exportDb,
  importDb,
  getCollection,
};
