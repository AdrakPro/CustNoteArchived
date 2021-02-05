<template>
  <div>
    <q-card
      class="lesson-card"
      flat
    >
      <div v-if="lessonTitle === null">
        <q-input
          v-model="lessonTitleInput"
          @keydown.enter="submitLessonTitle"
          class="lesson-input"
          style="padding: 3vh 1vh 0 1vh"
          autofocus
          color="positive"
          dense
        />
      </div>
      <div
        class="lesson-card__text"
        @click="redirectToNotes(lessonTitle)"
        v-else
      >{{ lessonTitle }}
        <Menu :menu-items="this.menuItems" />
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
    /* If redirecting is not disabled, redirect to LessonPage.vue with lessonTitle param */
    redirectToNotes(lessonTitle) {
      if (!this.isRedirectingDisabled) {
        this.$router.push({
          name: 'lesson',
          params: { lessonTitle },
        });
      }
    },

    /* Emit submitLessonTitle event with input value param */
    submitLessonTitle() {
      this.$emit('submitLessonTitle', this.lessonTitleInput);
    },
  },

  props: {
    lessonTitle: String,
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
.lesson-card {
  display: inline-block;
  min-width: 150px;
  max-width: 500px;
  height: 110px;
  margin: 15px;
  border-radius: 15px;
  border: 0.15rem solid #52D273;
  background-color: #464646;
  cursor: pointer;
  user-select: none;
}

.lesson-card__text {
  padding: 15px 15px 0 15px;
  font-size: 54px;
  text-align: center;
  color: #52D273;
}

.lesson-input input {
  text-align: center;
  font-size: 20px;
  color: #e8e6e3;
}
</style>
