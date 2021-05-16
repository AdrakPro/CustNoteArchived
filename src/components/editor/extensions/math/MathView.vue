<template>
  <span class="math">
    <span
      class="katex-render"
      :class="hidden"
      ref="render"
      v-show="!parentHasSelection()"
      :contenteditable="false"
    ></span>
    <span
      :contenteditable="false"
      class="decoration-inline-math"
      :class="active"
  >$</span>
    <span
     class="katex-editor"
      :class="active"
      ref="content"
  ></span>
    <span
      :contenteditable="false"
      class="decoration-inline-math"
      :class="active">$</span>
  </span>
</template>

<script>
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default {
  name: 'math',

  mounted() {
    if (this.node && this.node.textContent) {
      this.render(this.node.textContent);
    }
  },

  methods: {
    // Updates katex-render with node textContent.
    render(textContent) {
      katex.render(textContent, this.$refs.render, {
        throwOnError: false,
        displayMode: false,
        macros: {
          '\\s': '\\displaystyle\\sum_{#1}^{#2}',
          '\\l': '\\lim\\limits_{#1 \\rightarrow #2}',
        },
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
    'node.textContent': (textContent) => this.render(textContent),
  },

  props: ['node', 'view', 'getPos'],
};
</script>

<style lang="scss">
.ProseMirror {
  .Math {
    display: contents;

    .katex-editor {
      display: inline;
    }
  }
  .math {
    .katex-render {
      .katex {
        font-size: 18px;
      }

      .katex-error {
        font-family: "KaTeX_SansSerif", sans-serif;
        padding: 0;
      }
    }

    .decoration-inline-math {
      color: #52D273;
    }
  }
}

.math {
  display: inline-block;
  margin-top: 5px;

  .hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    border: 0;
    padding: 0;
    white-space: nowrap;
    clip-path: inset(100%);
    clip: rect(0 0 0 0);
    overflow: hidden;
  }

  .active {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    clip: auto;
    overflow: visible;
  }
}
</style>
