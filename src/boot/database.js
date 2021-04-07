import IdbAdapter from 'pouchdb-adapter-indexeddb';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBKeyCompressionPlugin } from 'rxdb/plugins/key-compression';
import { RxDBValidateZSchemaPlugin } from 'rxdb/plugins/validate-z-schema';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';

const sectionSchema = {
  keyCompression: true,
  version: 0,
  type: 'object',
  properties: {
    title: {
      type: 'string',
    },
    lessons: {
      type: 'array',
      default: [],
      items: {
        type: ['object', 'null'],
        properties: {
          id: {
            type: 'string',
          },
          title: {
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
        type: ['object', 'null'],
        properties: {
          title: {
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

const db = createDb().then((db) => db);

async function exportDb() {
  return db.then((db) => db.dump());
}

function importDb(jsonDb) {
  db.then((db) => {
    db.remove()
      .then(() => createDb()
        .then((db) => {
          db.importDump(jsonDb)
            .then(() => window.location.reload());
        }));
  });
}

function getCollection(collectionName) {
  return db.then((db) => db[collectionName]);
}

export {
  exportDb,
  importDb,
  getCollection,
};
