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

  props: ['node', 'view', 'getPos'],
};
</script>
