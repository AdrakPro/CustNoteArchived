export default class DialogModel {
  constructor() {
    this.title = null;
    this.containerName = null;
    this.show = false;
  }

  openDialog(dialogComponent) {
    const { title, containerName } = dialogComponent;

    this.title = title;
    this.containerName = containerName;
    this.show = true;
  }

  closeDialog() {
    this.show = false;
  }
}
