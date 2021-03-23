import { InputRule } from 'prosemirror-inputrules';
import { Node } from 'tiptap';

import katex from 'katex';
import 'katex/dist/katex.min.css';

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
      parseDOM: [{ tag: 'span.Math' }],
      toDOM: () => ['span', { class: 'Math' },
        ['span', { class: 'katex-render', contenteditable: 'false' }],
        ['span', { class: 'katex-editor' }, 0],
      ],
    };
  }

  get view() {
    return {
      name: 'Math',

      mounted() {
        if (this.node && this.node.textContent) {
          this.render(this.node.textContent);
        }
      },

      methods: {
        // Updates katex-render with node textContent.
        render(textContent) {
          katex.render(textContent, this.$refs.render, {
            throwOnError: false, displayMode: false,
          });
        },
        // Shows katex-render and hides katex-editor when selection is on parent.
        parentHasSelection() {
          const { selection: { anchor } } = this.view.state;
          const hasAnchor = this.getPos() < anchor && anchor < this.getPos() + this.node.nodeSize;

          return hasAnchor && this.view.focused && this.view.editable;
        },
      },

      computed: {
        active() {
          return this.parentHasSelection() ? 'active' : 'hidden';
        },
        hidden() {
          return this.parentHasSelection() ? 'hidden' : 'active';
        },
      },

      watch: {
        'node.textContent': (textContent) => {
          this.render(textContent);
        },
      },

      template: `
        <span class="Math">
          <span class="katex-render" :class="hidden" ref="render" v-show="!parentHasSelection()" contenteditable="false"></span><span contenteditable="false" class="decoration-inline-math" :class="active">$</span><span class="katex-editor" :class="active" ref="content"></span><span contenteditable="false" class="decoration-inline-math" :class="active">$</span>
        </span>
      `,

      props: ['node', 'view', 'getPos'],
    };
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
