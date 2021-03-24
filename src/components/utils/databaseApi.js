import { getCollection } from 'boot/database';

export default class DatabaseApi {
  constructor(collectionName, primaryKeyName) {
    this.collection = getCollection(collectionName);
    this.primaryKeyName = primaryKeyName;
  }

  async findAllDocs() {
    return new Promise((resolve) => {
      this.collection.then((collection) => {
        collection.find()
          .exec()
          .then((docs) => resolve(docs));
      }).catch((err) => throw err);
    });
  }

  async findDoc(keyValue) {
    return new Promise((resolve) => {
      this.collection.then((collection) => {
        collection.findOne()
          .where(this.primaryKeyName)
          .eq(keyValue)
          .exec()
          .then((doc) => resolve(doc));
      }).catch((err) => throw err);
    });
  }

  async insertDoc(object) {
    this.collection.then((collection) => {
      collection.insert(object);
    }).catch((err) => throw err);
  }

  async updateDoc(keyValue, query) {
    await this.findDoc(keyValue).then((doc) => {
      doc.update(query);
    }).catch((err) => throw err);
  }

  async atomicUpdate(keyValue, changeFn) {
    await this.findDoc(keyValue).then((doc) => {
      doc.atomicUpdate(changeFn);
    }).catch((err) => throw err);
  }

  async deleteDoc(keyValue) {
    await this.findDoc(keyValue).then((doc) => {
      if (doc !== null) {
        doc.remove();
      }
    }).catch((err) => throw err);
  }
}

const SECTIONS = 'sections';
const SUBJECTS = 'subjects';

const SECTIONS_PRIMARY_KEY = 'sectionTitle';
const SUBJECTS_PRIMARY_KEY = 'lessonId';

export {
  SECTIONS,
  SUBJECTS,
  SECTIONS_PRIMARY_KEY,
  SUBJECTS_PRIMARY_KEY,
};
