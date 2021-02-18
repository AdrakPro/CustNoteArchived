export default class TreeNode {
  constructor(label, type = 'module') {
    switch (type) {
      case 'module':
        this.label = label;
        this.children = [];
        this.style = 'module-node';
        this.lazy = true;
        break;
      case 'subject':
        this.label = label;
        this.style = 'subject-node';
        break;
      default:
        throw new Error('Tree node is missing a key parameter');
    }
  }
}
