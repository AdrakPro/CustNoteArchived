<template>
  <div v-if="lesson !== undefined">
    <q-card class="lesson-card">
      <div v-if="lesson.lessonTitle === null">
        <q-input
          v-model="lessonTitleInput"
          @keydown.enter="submitLessonTitle"
          maxlength="16"
          style="padding: 2vh 1vh 0 1vh"
          class="lesson-card__input"
          color="positive"
          autofocus
        />
      </div>
      <div
        v-else
        @click="redirectToNotes(lesson.lessonId)"
        class="lesson-card__text"
      >{{ lesson.lessonTitle }}
        <Menu :menu-items="menuItems" />
      </div>
    </q-card>
  </div>
</template>

<script>
import Menu from 'components/Menu';

export default {
  name: 'LessonCard',

  data() {
    return {
      lessonTitleInput: '',
    };
  },

  methods: {
    /* If redirecting is not disabled, redirect to LessonPage.vue with lessonId param */
    redirectToNotes(lessonId) {
      if (!this.isRedirectingDisabled) {
        this.$router.push({
          name: 'lesson',
          params: { lessonId },
        });
      }
    },

    /* Emit submitLessonTitle with input value */
    submitLessonTitle() {
      this.$emit('submitLessonTitle', this.lessonTitleInput);
    },
  },

  props: {
    lesson: Object,
    menuItems: Array,
    isRedirectingDisabled: {
      type: Boolean,
      default: false,
    },
  },

  components: { Menu },
};
</script>

<style lang="scss" scoped>
.lesson-card__text {
  padding: 15px 15px 0 15px;
  font-size: 54px;
  text-align: center;
  color: #52D273;
}

.lesson-card__input input {
  height: 30px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  color: #52D273;
}
</style>
