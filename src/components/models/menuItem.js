export default class MenuItem {
  constructor(itemTitle, executeFn, executeFnParams = []) {
    this.itemTitle = itemTitle;
    this.executeFn = executeFn;
    this.executeFnParams = executeFnParams;
  }
}
