class KeyListener {
  constructor() {
    this.boundListener = null;
  }

  // add bulk key listeners
  addKeyListener(key, fn, vmToBind) {
    this.keyListener = ((e) => {
      if (e.key === key && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();

        fn();
      }
    });

    this.boundListener = this.keyListener.bind(vmToBind);

    document.addEventListener('keydown', this.boundListener);
  }

  destroyKeyListener() {
    document.removeEventListener('keydown', this.boundListener);
  }
}

const CTRL_S = 's';

export {
  KeyListener,
  CTRL_S,
};
