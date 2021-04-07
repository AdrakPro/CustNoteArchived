export default class MenuItem {
  constructor(text, executeFn, executeFnParams = []) {
    this.text = text;
    this.executeFn = executeFn;
    this.executeFnParams = executeFnParams;
  }
}
