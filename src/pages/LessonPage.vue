<template>
  <q-page class="row">
    <div class="parent-container">
      <LessonTree @emitSubjectToNoteEditor="emitSubjectToNoteEditor"></LessonTree>
      <NoteEditor :subject="selectedSubject"></NoteEditor>
    </div>
  </q-page>
</template>
<script>
import LessonTree from 'components/LessonTree';
import NoteEditor from 'components/NoteEditor';

export default {
  name: 'LessonPage',

  data() {
    return {
      selectedSubject: null,
    };
  },

  created() {
    this.selectedSubject = {
      subjectTitle: null,
      content: '',
    };
  },

  methods: {
    emitSubjectToNoteEditor(selectedSubject) {
      this.selectedSubject = selectedSubject;
    },
  },

  components: { NoteEditor, LessonTree },
};
</script>

<style>
.parent-container {
  display: flex;
}
</style>
