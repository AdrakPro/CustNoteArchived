<template>
  <q-card
    class="lesson-card"
    @click="redirectToSubjects(lesson.id)"
  >
    <q-input
      v-if="lesson.title === null"
      v-model="titleInput"
      @keydown.enter="submitLesson"
      maxlength="16"
      style="padding: 2vh 1vh 0 1vh"
      color="positive"
      autofocus
    />
    <div
      v-else
    >{{ lesson.title }}
      <Menu :menu-items="menuItems" />
    </div>
  </q-card>
</template>

<script>
import Menu from 'components/Menu';

export default {
  name: 'LessonCard',

  data() {
    return {
      titleInput: '',
    };
  },

  methods: {
    redirectToSubjects(lessonId) {
      if (this.isRedirectingEnabled) {
        this.$router.push({
          name: 'lesson',
          params: { lessonId },
        });
      }
    },

    submitLesson() {
      this.$emit('submitLesson', this.titleInput);
    },
  },

  props: {
    lesson: Object,
    menuItems: Array,
    isRedirectingEnabled: {
      type: Boolean,
      default: true,
    },
  },

  components: { Menu },
};
</script>

<style lang="scss">
.lesson-card {
  display: inline-block;
  min-width: 150px;
  max-width: 500px;
  height: 110px;
  margin: 15px;
  border-radius: 15px;
  border: 0.15rem solid $positive;
  background-color: #464646;
  cursor: pointer;
  user-select: none;
}

.lesson-card > div {
  height: 30px;
  padding: 15px 15px 0 15px;
  font-size: 54px;
  text-align: center;
  color: $positive;
}
</style>
