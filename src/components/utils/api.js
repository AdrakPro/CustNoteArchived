class Api {
  constructor(object) {
    this.object = object;
  }

  createUniqueKey() {
    if (this.getObjectLength() !== 0) {
      return Math.max(...Object.keys(this.object).map((key) => Number.parseInt(key, 10))) + 1;
    }

    return 0;
  }

  isObjectHasNullField(objectField) {
    const array = Object.values(this.object);

    for (let i = 0, l = array.length; i < l; ++i) {
      if (array[i][objectField] === null) {
        return true;
      }
    }

    return false;
  }

  validateInput(input, condition) {
    return input !== '' && this.isValueUnique(condition);
  }

  getObjectIndex(condition) {
    return Object.values(this.object).findIndex(condition);
  }

  getObjectKey(keyIndex) {
    return Number.parseInt(Object.keys(this.object)[keyIndex], 10);
  }

  getObjectLength() {
    return Object.keys(this.object).length;
  }

  isValueUnique(condition) {
    return this.getObjectIndex(condition) === -1;
  }

  /* Convert it to base 36 (numbers + letters), and grab the first 9 characters */
  static generateUniqueID() {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default Api;
