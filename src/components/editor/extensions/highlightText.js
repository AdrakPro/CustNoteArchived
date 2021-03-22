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
          tag: 'mark',
        },
      ],
      toDOM: () => [
        'mark', {
          style: 'color: #52D273; padding: 1px; background: #333333',
        }, 0,
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
