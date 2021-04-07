import { getCollection } from 'boot/database';

class DatabaseApi {
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

  async findDoc(docKey) {
    return new Promise((resolve) => {
      this.collection.then((collection) => {
        collection.findOne()
          .where(this.primaryKeyName)
          .eq(docKey)
          .exec()
          .then((doc) => resolve(doc));
      });
    });
  }

  async insertDoc(object) {
    this.collection.then((collection) => collection.insert(object));
  }

  async updateDoc(docKey, query) {
    await this.findDoc(docKey).then((doc) => doc.update(query));
  }

  async atomicUpdate(docKey, changeFn) {
    await this.findDoc(docKey).then((doc) => doc.atomicUpdate(changeFn));
  }

  async upsertDoc(previousTitle, content) {
    if (previousTitle === null) {
      await this.insertDoc(content);
    } else {
      await this.updateDoc(previousTitle, {
        $set: content,
      });
    }
  }

  async atomicUpsert({ previousTitle, docKey, content, changeFn }) {
    if (previousTitle === null) {
      await this.updateDoc(docKey, {
        $push: content,
      });
    } else {
      await this.atomicUpdate(docKey, changeFn);
    }
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

const SECTIONS_PRIMARY_KEY = 'title';
const SUBJECTS_PRIMARY_KEY = 'lessonId';

export {
  DatabaseApi,
  SECTIONS,
  SUBJECTS,
  SECTIONS_PRIMARY_KEY,
  SUBJECTS_PRIMARY_KEY,
};
