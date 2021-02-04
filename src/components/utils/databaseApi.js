import getCollection from 'boot/database';

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
    this.collection.then((collection) => collection.insert(object));
  }

  async updateNestedFields(keyValue, changeFn) {
    await this.findDoc(keyValue).then((doc) => {
      doc.atomicUpdate(changeFn);
    });
  }

  async deleteNestedFields(keyValue, object) {
    await this.findDoc(keyValue).then((doc) => {
      doc.atomicPatch(object);
    });
  }

  async updateDoc(keyValue, query) {
    await this.findDoc(keyValue).then((doc) => {
      doc.update(query);
    });
  }

  async deleteDoc(keyValue) {
    await this.findDoc(keyValue).then((doc) => doc.remove());
  }
}

export default DatabaseApi;

const SECTIONS_NAME = 'sections';
const SECTIONS_PRIMARY_KEY = 'sectionTitle';

export {
  SECTIONS_NAME,
  SECTIONS_PRIMARY_KEY,
};
