import { InputRule } from 'prosemirror-inputrules';
import { Node } from 'tiptap';

import MathView from 'components/editor/extensions/math/MathView';

import './math.css';
import { deleteMath } from './mathKeymaps.js';

/*
 * Defines a ComponentView for Math.
 */
export default class Math extends Node {
  get name() {
    return 'math';
  }

  get schema() {
    return {
      code: true,
      content: 'text*',
      marks: '',
      group: 'inline',
      inline: true,
      defining: true,
      isolating: true,
      parseDOM: [{ tag: 'span.math' }],
      toDOM: () => ['span', { class: 'math' },
        ['span', { class: 'katex-render', contenteditable: 'false' }],
        ['span', { class: 'katex-editor' }, 0],
      ],
    };
  }

  get view() {
    return MathView;
  }

  inputRules({ type, getAttrs }) {
    return [
      new InputRule(/(?:\$)([^$\s]+(?:\s+[^$\s]+)*)(?:\$)$/, (state, match, start, end) => {
        const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        const [matchedText, content] = match;
        const { tr, schema } = state;

        if (matchedText) {
          tr.replaceWith(start, end, type.create(attrs, schema.text(content)));
        }

        return tr;
      }),
    ];
  }

  keys({ type }) {
    return {
      Backspace: deleteMath,
    };
  }
}
