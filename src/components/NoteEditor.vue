<template>
  <div class="editor-parent">
    <editor-menu-bar
      v-if="subject.subjectTitle !== null"
      :editor="editor"
      v-slot="{ commands }"
    >
      <div class="menubar">
        <q-btn icon="add" @click="commands.bold" class="menubar-button"/>
      </div>
    </editor-menu-bar>
    <div
      v-if="subject.content !== ''"
      class="editor"
    >
    </div>
  </div>
</template>

<script>
import { Editor, EditorMenuBar } from 'tiptap';
import { Bold } from 'tiptap-extensions';

export default {
  name: 'NoteEditor',

  data() {
    return {
      editor: null,
    };
  },

  created() {
    this.initializeEditor();
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    initializeEditor() {
      this.editor = new Editor({
        extensions: [
          new Bold(),
        ],
      });
    },
  },

  props: {
    subject: Object,
  },

  components: { EditorMenuBar },
};
</script>

<style>
.editor-parent {
  margin: 15px;
  padding: 15px;
  background-color: #464646;
  width: calc(100vw - 330px);
  color: #e8e6e3;
}

.menubar {
  border-bottom: 1px solid #ccc;
}

.menubar-button {
  border: 0;
  outline: 0;
  margin-right: 0.5em;
  font-size: large;
  margin-bottom: 6px;
  margin-top: 3px;
}
</style>
