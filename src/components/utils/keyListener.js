/* Class-based key listener */
class KeyListener {
  constructor() {
    this.boundListener = null;
  }

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

export default KeyListener;
