import { Mark } from 'tiptap';
import { toggleMark } from 'prosemirror-commands';

export default class HighlightText extends Mark {
  get name() {
    return 'highlight_text';
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: 'highlight',
        },
      ],
      toDOM: () => [
        'highlight', 0,
      ],
    };
  }

  commands({ type }) {
    return () => toggleMark(type);
  }

  keys({ type }) {
    return {
      'Ctrl-h': toggleMark(type),
    };
  }
}
