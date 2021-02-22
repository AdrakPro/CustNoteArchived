import getCollection from 'boot/database';

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
      });
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
      });
    });
  }

  async insertDoc(object) {
    this.collection.then((collection) => {
      collection.insert(object);
    });
  }

  async updateDoc(keyValue, query) {
    await this.findDoc(keyValue).then((doc) => {
      doc.update(query);
    });
  }

  async atomicUpdate(keyValue, changeFn) {
    await this.findDoc(keyValue).then((doc) => {
      doc.atomicUpdate(changeFn);
    });
  }

  async deleteDoc(keyValue) {
    await this.findDoc(keyValue).then((doc) => {
      if (doc !== null) {
        doc.remove();
      }
    });
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
