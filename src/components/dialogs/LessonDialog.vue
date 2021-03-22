<template>
  <div class="row wrap">
    <LessonCard
      v-for="lessonTitle in getSectionLessonsBy(this.sectionTitle)"
      :key="lessonTitle"
      :lesson="lessons[lessonTitle]"
      :is-redirecting-disabled="true"
      :menu-items="createMenuItems(lessonTitle)"
      @submitLessonTitle="submitLessonTitle"
    />
    <q-card class="lesson-card">
      <q-icon
        @click="createLesson"
        class="lesson-card__add"
        name="mdi-plus"
      />
    </q-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DatabaseApi, { SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import MenuItem from 'components/models/menuItem';
import LessonCard from 'components/LessonCard';

export default {
  name: 'LessonDialog',

  data() {
    return {
      sectionTitle: this.dialogTitle,
    };
  },

  created() {
    this.db = new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY);
  },

  beforeDestroy() {
    this.deleteUnSubmittedLesson();
  },

  methods: {
    /* If sections have not got null field, create dummy object to trigger q-input */
    createLesson() {
      if (!this.isLessonsHaveNullField()) {
        this.$store.dispatch('sectionStore/createEmptyLesson', {
          sectionTitle: this.sectionTitle,
          lessonId: this.generateLessonId(),
        });
        this.$store.dispatch('menuStore/disableMenu');
      }
    },

    /* Triggers when enter is pressed on q-input, validate input, persist data to store and db */
    submitLessonTitle(lessonTitle) {
      if (this.validateInput(lessonTitle)) {
        if (this.previousTitle === null) {
          this.db.updateDoc(this.sectionTitle, {
            $push: {
              lessons: {
                lessonTitle,
                lessonId: this.lessons.null.lessonId,
              },
            },
          });
        } else {
          this.db.atomicUpdate(this.sectionTitle, (oldData) => {
            const previousLessonIndex = this.findLessonIndex(oldData.lessons, this.previousTitle);

            oldData.lessons[previousLessonIndex].lessonTitle = lessonTitle;
            return oldData;
          });
        }

        this.$store.dispatch('sectionStore/setPreviousTitle', null);
        this.$store.dispatch('sectionStore/setLesson', {
          sectionTitle: this.sectionTitle,
          lessonTitle,
        });
      } else {
        this.deleteLesson(null);
      }

      this.$store.dispatch('menuStore/enableMenu');
    },

    /* Delete lesson from store and db using it's key */
    deleteLesson(lessonTitle) {
      if (lessonTitle !== null) {
        this.db.atomicUpdate(this.sectionTitle, (oldData) => {
          const lessonIndex = this.findLessonIndex(oldData.lessons, lessonTitle);

          delete oldData.lessons[lessonIndex];
          return oldData;
        });
      }

      this.$store.dispatch('sectionStore/deleteLesson', {
        sectionTitle: this.sectionTitle,
        lessonTitle,
      });
    },

    /* Set lessonTitle to null, triggering q-input */
    renameLesson(previousTitle) {
      this.$store.dispatch('sectionStore/setPreviousTitle', previousTitle);
      this.$store.dispatch('sectionStore/setLesson', {
        sectionTitle: this.sectionTitle,
        lessonTitle: null,
      });
      this.$store.dispatch('menuStore/disableMenu');
    },

    /* Check if the last lesson has null lessonTitle field, if so delete it */
    deleteUnSubmittedLesson() {
      if (this.isLessonsHaveNullField()) {
        this.deleteLesson(null);
        this.$store.dispatch('menuStore/enableMenu');
      }
    },

    createMenuItems(lessonTitle) {
      return [
        new MenuItem('Rename', this.renameLesson, [lessonTitle]),
        new MenuItem('Delete', this.deleteLesson, [lessonTitle]),
      ];
    },

    validateInput(inputValue) {
      return inputValue !== '' && this.lessons[inputValue] === undefined;
    },

    findLessonIndex(lessons, lessonTitle) {
      return lessons.findIndex((lesson) => {
        if (lesson !== undefined) {
          return lesson.lessonTitle === lessonTitle;
        }

        return false;
      });
    },

    generateLessonId() {
      return Math.random().toString(36).substr(2, 9);
    },

    isLessonsHaveNullField() {
      return Object.prototype.hasOwnProperty.call(this.lessons, 'null');
    },
  },

  computed: {
    ...mapState('sectionStore', {
      previousTitle: (state) => state.previousTitle,
      lessons: (state) => state.lessons,
    }),

    ...mapGetters('sectionStore', {
      getSectionLessonsBy: 'getSectionLessonsBy',
    }),
  },

  props: {
    dialogTitle: String,
  },

  components: { LessonCard },
};
</script>

<style lang="scss" scoped>
.lesson-card {
  border: 0.15rem dashed #52D273;
};

.lesson-card__add {
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: #52D273;
  cursor: pointer;
}
</style>
