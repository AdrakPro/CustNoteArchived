export default class TreeNode {
  constructor(label, id, parentId = null, type = 'module') {
    switch (type) {
      case 'module':
        this.label = label;
        this.id = id;
        this.children = [];
        this.style = 'module-node';
        this.lazy = true;
        break;
      case 'subject':
        this.label = label;
        this.id = id;
        this.parentId = parentId;
        this.style = 'subject-node';
        break;
      default:
        throw new Error('Tree node is missing a key parameter');
    }
  }
}
