<template>
  <div
    v-if="selectedSubject.id !== null"
    class="editor"
    spellcheck="false"
  >
    <editor-menu-bar
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div class="menubar">
        <div class="menubar__group">
          <q-btn
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
            icon="mdi-format-bold"
            unelevated
          />
          <q-btn
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
            icon="mdi-format-italic"
            unelevated
          />
          <q-btn
            :class="{ 'is-active': isActive.highlight_text() }"
            @click="commands.highlight_text"
            icon="mdi-format-color-highlight"
            unelevated
          />
        </div>
        <div class="menubar__group">
          <q-btn
            :class="{ 'is-active': isActive.heading({ level: 1}) }"
            @click="commands.heading({ level: 1})"
            icon="mdi-format-title"
            unelevated
          />
          <q-btn
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
            icon="mdi-format-list-bulleted"
            unelevated
          />
          <q-btn
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
            icon="mdi-format-list-numbered"
            unelevated
          />
          <q-btn
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
            icon="mdi-format-quote-close"
            unelevated
          />
          <q-btn
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
            icon="mdi-code-tags"
            unelevated
          />
          <q-btn
            @click="showImagePrompt(commands.image)"
            icon="mdi-image"
            unelevated
          />
          <q-btn
            v-if="!isActive.table()"
            @click="commands.createTable({ rowsCount: 2, colsCount: 2, withHeaderRow: true })"
            icon="mdi-table"
            unelevated
          />
          <q-btn
            v-else
            @click="commands.deleteTable"
            icon="mdi-table-remove"
            unelevated
          />
        </div>
        <div
          v-if="isActive.table()"
          class="menubar__group"
        >
          <q-btn
            @click="commands.addColumnBefore"
            icon="mdi-table-column-plus-before"
            unelevated
          />
          <q-btn
            @click="commands.addColumnAfter"
            icon="mdi-table-column-plus-after"
            unelevated
          />
          <q-btn
            @click="commands.deleteColumn"
            icon="mdi-table-column-remove"
            unelevated
          />
          <q-btn
            @click="commands.addRowBefore"
            icon="mdi-table-row-plus-before"
            unelevated
          />
          <q-btn
            @click="commands.addRowAfter"
            icon="mdi-table-row-plus-after"
            unelevated
          />
          <q-btn
            @click="commands.deleteRow"
            icon="mdi-table-row-remove"
            unelevated
          />
          <q-btn
            @click="commands.toggleCellMerge"
            icon="mdi-table-merge-cells"
            unelevated
          />
        </div>
      </div>
    </editor-menu-bar>
    <div class="editor__content">
      <editor-content :editor="editor"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DatabaseApi, SUBJECTS, SUBJECTS_PRIMARY_KEY } from 'components/utils/databaseApi';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  Bold,
  BulletList,
  CodeBlock,
  CodeBlockHighlight,
  HardBreak,
  Heading,
  History,
  Image,
  Italic,
  ListItem,
  OrderedList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TrailingNode,
} from 'tiptap-extensions';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import xml from 'highlight.js/lib/languages/xml';
import HighlightText from 'components/editor/extensions/highlightText';
import InlineMath from 'components/editor/extensions/math/math';

export default {
  name: 'Editor',

  data() {
    return {
      editor: null,
    };
  },

  created() {
    this.lessonId = this.$route.params.lessonId;
    this.db = new DatabaseApi(SUBJECTS, SUBJECTS_PRIMARY_KEY);
    this.editor = this.getEditor();
  },

  beforeDestroy() {
    this.persistSubjectContent(this.selectedSubject);
    this.resetSelectedSubject();
    this.editor.destroy();
  },

  methods: {
    getEditor() {
      return new Editor({
        extensions: [
          new Heading({ levels: [1] }),
          new BulletList(),
          new OrderedList(),
          new Blockquote(),
          new CodeBlock(),
          new Image(),
          new CodeBlockHighlight({
            languages: { javascript, css, scss, xml },
          }),
          new ListItem(),
          new Bold(),
          new Italic(),
          new InlineMath(),
          new HighlightText(),
          new History(),
          new TrailingNode({ node: 'paragraph', notAfter: ['paragraph'] }),
          new HardBreak(),
          new Table({ resizable: true }),
          new TableRow(),
          new TableHeader(),
          new TableCell(),
          new Image(),
        ],
      });
    },

    // Unfixed bug => deleting selected subject content null
    persistSubjectContent(subject) {
      const { id } = subject;

      if (id !== null) {
        const content = this.editor.getHTML();

        this.db.atomicUpdate(this.lessonId, (oldData) => {
          oldData.subjects[id].content = content;

          return oldData;
        }).then(() => this.$store.dispatch('editorStore/setSubjectContent', { subject, content }));
      }
    },

    setEditorContent(content) {
      if (content !== null) {
        this.editor.setContent(content);
      }
    },

    unselectSubject(subject) {
      this.$store.dispatch('editorStore/selectSubject', {
        subject,
        selected: false,
      });
    },

    showImagePrompt(command) {
      this.$q.dialog({
        sectionTitle: 'Enter the url of image',
        class: 'dialog',
        color: 'positive',
        prompt: {
          rounded: true,
          model: '',
          isValid: (url) => this.isUrlHasImageExtension(url),
          type: 'text',
        },
        cancel: true,
      }).onOk((src) => command({ src }));
    },

    isUrlHasImageExtension(url) {
      return url.match(/\.(jpeg|jpg|gif|png|svg)$/) !== null;
    },

    resetSelectedSubject() {
      this.$store.dispatch('editorStore/resetSelectedSubject');
    },
  },

  computed: {
    ...mapState('editorStore', {
      selectedSubject: (state) => state.selectedSubject,
    }),
  },

  watch: {
    selectedSubject(nextSubject, previousSubject) {
      if (this.selectedSubject.id !== null) {
        this.unselectSubject(previousSubject);
        this.persistSubjectContent(previousSubject);
        this.setEditorContent(nextSubject.content);
        this.editor.focus();
      }
    },
  },

  components: { EditorMenuBar, EditorContent },
};
</script>

<style lang="scss">
.editor {
  width: calc(100vw - 330px);
  margin: 15px;
  padding: 5px 15px;
  border-radius: 10px;
  background-color: #464646;
  color: $white;
  box-shadow: 0 5px 15px 1px rgba(51,51,51,0.8);

  :focus {
    outline: none;
  }

  &__content {
    position: fixed;
    width: calc(100vw - 345px);
    height: calc(100vh - 162px);
    font-size: 16px;
    padding-right: 15px;

    overflow-y: auto;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    .ProseMirror {
      white-space: pre-wrap;
    }

    * {
      caret-color: currentColor;
    }

    blockquote,
    h1,
    ol,
    pre,
    ul {
      margin-bottom: 0;
    }

    blockquote:first-child,
    h1:first-child,
    ol:first-child,
    p:first-child,
    pre:first-child,
    ul:first-child {
      margin-top: 0;
    }

    blockquote:last-child,
    h1:last-child,
    ol:last-child,
    p:last-child,
    pre:last-child,
    ul:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 0;
      font-size: 17px;
    }

    h1 {
      text-align: center;
      line-height: 1.3;
      margin: 0 0 5px;
      font-size: 48px;
      color: $positive;
    }

    img {
      display: inline-block;
      margin: 10px 0 10px 0;
      max-width: 400px;
      max-height: 400px;
      border-radius: 5px;
    }

    highlight {
      display: inline-block;
      margin: 10px 0 10px 0;
      padding: 0 2px 0 2px;
      background-color: $dark;
      color: $positive;
    }

    pre {
      padding: .7rem 1rem;
      border-left: 3px solid $positive;
      border-radius: 5px;
      background: #333333;
      font-size: .8rem;
      overflow-x: hidden;

      &::before {
        content: attr(data-language);
        text-transform: uppercase;
        text-align: right;
        font-weight: bold;
        font-size: 0.6rem;
      }

      code {
        display: block;

        .hljs-comment,
        .hljs-quote {
          color: $secondary;
          font-style: italic;
        }

        .hljs-doctag,
        .hljs-keyword,
        .hljs-formula,
        .hljs-built_in,
        .hljs-literal {
          color: #c678dd;
        }
        .hljs-section,
        .hljs-name,
        .hljs-selector-tag,
        .hljs-deletion,
        .hljs-subst {
          color: #e06c75;
        }

        .hljs-string,
        .hljs-regexp,
        .hljs-addition,
        .hljs-meta-string {
          color: #98c379;
        }

        .hljs-class,
        .hljs-title {
          color: #e6c07b;
        }

        .hljs-variable,
        .hljs-template-variable,
        .hljs-type,
        .hljs-selector-class,
        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-attr,
        .hljs-number {
          color: #d19a66;
        }

        .hljs-symbol,
        .hljs-bullet,
        .hljs-link,
        .hljs-meta,
        .hljs-selector-id,
        .hljs-title {
          color: #61aeee;
        }

        .hljs-emphasis {
          font-style: italic;
        }

        .hljs-strong {
          font-weight: bold;
        }

        .hljs-link {
          text-decoration: underline;
        }
      }
    }

    ol, ul {
      padding-left: 8px;
      list-style: none;

      li {
        margin-bottom: 5px;
      }

      li:last-child {
        margin-bottom: 10px;
      }
    }

    li > ol,
    li > p,
    li > ul {
      margin: 0;
    }

    li > p {
      display: inline;
    }

    ol {
      counter-reset: item;

      & > li::before {
        counter-increment: item;
        content: counter(item) ' )';
        padding-right: 5px;
        color: $positive;
        font-weight: bold;
      }
    }

    ul li::before {
      content: '=>';
      padding-right: 5px;
      color: $positive;
      font-weight: bold;
    }

    blockquote {
      text-align: center;
      margin: 0 auto;
      padding: 0 5px;
      background: transparent;
      border: 2px dotted $positive;
      max-width: 30vw;
    }

    table {
      border-collapse: collapse;
      table-layout: fixed;
      align-items: center;
      width: 100%;
      margin: 0 auto;
      overflow: hidden;

      td, th {
        min-width: 1em;
        border: 2px solid $secondary;
        padding: 3px 5px;
        text-align: center;
        box-sizing: border-box;
        position: relative;
        > * {
          margin-bottom: 0;
        }
      }

      th {
        font-weight: bold;
        background-color: #416C4C;
      }

      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0; right: 0; top: 0; bottom: 0;
        background: rgba(179, 184, 188, 0.3);
        pointer-events: none;
      }

      .column-resize-handle {
        position: absolute;
        right: -2px; top: 0; bottom: 0;
        width: 4px;
        z-index: 20;
        pointer-events: none;
      }
    }

    .tableWrapper {
      max-width: 100%;
      overflow-x: auto;
      margin: 1em 0;
    }

    .resize-cursor {
      cursor: col-resize;
    }
  }
}

.menubar {
  text-align: center;
  border-bottom: 2px solid $positive;
  margin-bottom: 15px;
}

.menubar__group {
  display: inline-block;
  border-right: 1px inset $positive;
  margin: 0 5px 5px 0;

  &:last-child {
    border: none;
    margin: 0;
  }
}

.menubar__group > button[type="button"] {
  margin-right: 3px;
  color: $positive;
  width: 36px;
  height: 36px;
}

.menubar__group > button[type="button"].is-active {
  background-color: #515c54;
}
</style>
