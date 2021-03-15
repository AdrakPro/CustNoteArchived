<template>
  <q-page class="row">
    <div class="parent-container">
      <LessonTree></LessonTree>
      <NoteEditor></NoteEditor>
    </div>
  </q-page>
</template>
<script>
import LessonTree from 'components/LessonTree';
import NoteEditor from 'components/editor/Editor';

export default {
  name: 'LessonPage',

  components: { NoteEditor, LessonTree },
};
</script>

<style>
.parent-container {
  display: flex;
}
</style>
