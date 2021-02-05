<template>
  <div
    class="row wrap"
    :key="lessonsDivKey"
  >
    <LessonCard
      v-for="lesson in lessons"
      :key="lesson.lessonTitle"
      :lesson-title="lesson.lessonTitle"
      :menu-items="createMenuItems(lesson.lessonTitle)"
      :is-redirecting-disabled="true"
      @submitLessonTitle="submitLessonTitle"
    />
    <q-card class="lesson-card">
      <q-icon
        class="lesson-card__add"
        name="add"
        @click="createLesson"
      />
    </q-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Api from 'components/utils/api';
import LessonCard from 'components/LessonCard';
import DatabaseApi, { SECTIONS_NAME, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';

export default {
  name: 'LessonsDialog',

  data() {
    return {
      api: null,
      db: null,
      lessons: null,
      sectionKey: null,
      lessonsDivKey: 0,
    };
  },

  created() {
    this.lessons = this.getLessonsBy(this.dialogTitle);
    this.sectionKey = this.getSectionKey(this.dialogTitle);
    this.api = new Api(this.lessons);
    this.db = new DatabaseApi(SECTIONS_NAME, SECTIONS_PRIMARY_KEY);
  },

  beforeDestroy() {
    this.deleteUnSubmittedLesson();
  },

  methods: {
    /* Check if other lessons haven't got any null titles, then persist a dummy object, which will trigger submitLessonTitle */
    createLesson() {
      if (!this.api.isObjectHasNullField('lessonTitle')) {
        this.$store.dispatch('sectionStore/disableMenu');
        this.$store.dispatch('sectionStore/createEmptyLesson', {
          sectionKey: this.sectionKey,
          lessonKey: this.api.createUniqueKey(),
          lesson: {
            lessonTitle: null,
          },
        });

        this.rerenderLessons();
      }
    },

    /* Triggers when q-input condition is true, validate input, persist to store and db, delete when input is not unique */
    submitLessonTitle(lessonTitleInputValue) {
      const lessonKey = this.getLessonKey(this.getLessonIndex(null));

      if (this.api.validateInput(lessonTitleInputValue, (lesson) => lesson.lessonTitle === lessonTitleInputValue)) {
        this.$store.dispatch('sectionStore/setLessonTitle', {
          sectionKey: this.sectionKey,
          lessonKey,
          lessonTitleValue: lessonTitleInputValue,
        });

        if (this.previousTitle === null) {
          this.db.updateDoc(this.dialogTitle, {
            $push: {
              lessons: {
                lessonTitle: lessonTitleInputValue,
              },
            },
          });
        } else {
          this.db.updateNestedFields(this.dialogTitle, (oldData) => {
            oldData.lessons[lessonKey].lessonTitle = lessonTitleInputValue;
            return oldData;
          });
        }

        this.$store.dispatch('sectionStore/setPreviousTitle', null);
      } else {
        this.deleteLesson(lessonKey);
      }

      this.$store.dispatch('sectionStore/enableMenu');

      this.rerenderLessons();
    },

    /* Delete lesson from store and db using it's key */
    deleteLesson(lessonKey) {
      this.db.updateNestedFields(this.dialogTitle, (oldData) => {
        delete oldData.lessons[lessonKey];
        return oldData;
      });
      this.$store.dispatch('sectionStore/deleteLesson', {
        sectionKey: this.sectionKey,
        lessonKey,
      });
    },

    /* Set lessonTitle to null, triggering submitLessonTitle */
    renameLesson(lessonKey) {
      this.$store.dispatch('sectionStore/disableMenu');
      this.$store.dispatch('sectionStore/setPreviousTitle', this.lessons[lessonKey].lessonTitle);
      this.$store.dispatch('sectionStore/setLessonTitle', {
        sectionKey: this.sectionKey,
        lessonKey,
        lessonTitleValue: null,
      });

      this.rerenderLessons();
    },

    /* Check if the last lesson has null lessonTitle field, if so delete it */
    deleteUnSubmittedLesson() {
      if (this.api.isObjectHasNullField('lessonTitle')) {
        const lessonKey = this.getLessonKey(this.getLessonIndex(null));
        this.deleteLesson(lessonKey);
        this.$store.dispatch('sectionStore/enableMenu');
      }
    },

    createMenuItems(lessonTitle) {
      const lessonKey = this.getLessonKey(this.getLessonIndex(lessonTitle));

      return [
        {
          itemTitle: 'Delete lesson',
          executeFunc: this.deleteLesson,
          executeFuncParams: [lessonKey],
        },
        {
          itemTitle: 'Rename lesson',
          executeFunc: this.renameLesson,
          executeFuncParams: [lessonKey],
        },
      ];
    },

    rerenderLessons() {
      this.lessonsDivKey += 1;
    },

    getLessonIndex(lessonTitle) {
      return this.api.getObjectIndex((lesson) => lesson.lessonTitle === lessonTitle);
    },

    getLessonKey(lessonIndex) {
      return this.api.getObjectKey(lessonIndex);
    },
  },

  computed: {
    ...mapGetters('sectionStore', {
      getLessonsBy: 'getLessonsBy',
      getSectionKey: 'getSectionKeyBy',
    }),

    ...mapState('sectionStore', {
      previousTitle: (state) => state.previousTitle,
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
  display: inline-block;
  min-width: 150px;
  max-width: 500px;
  height: 110px;
  margin: 15px;
  border: 0.15rem dashed #52D273;
  border-radius: 15px;
  background-color: #464646;
  user-select: none;
}

.lesson-card__add {
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: #52D273;
  cursor: pointer;
}
</style>
