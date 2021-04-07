<template>
  <div class="row wrap">
    <LessonCard
      v-for="title in getLessons(this.sectionTitle)"
      :key="title"
      :lesson="lessons[title]"
      :is-redirecting-enabled="false"
      :menu-items="menuItems(title)"
      @submitLesson="submitLesson"
    />
    <q-card class="empty-lesson-card">
      <q-icon
        @click="createLesson"
        class="empty-lesson-card__icon"
        name="mdi-plus"
      />
    </q-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { DatabaseApi, SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import MenuItem from 'components/models/menuItem';
import LessonCard from 'components/LessonCard';

export default {
  name: 'LessonDialog',

  created() {
    this.db = new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY);
    this.sectionTitle = this.dialogTitle;
  },

  beforeDestroy() {
    this.deleteUnSubmittedLesson();
  },

  methods: {
    createLesson() {
      if (!this.isUnSubmittedLessonExists) {
        this.$store.dispatch('sectionStore/createEmptyLesson', {
          sectionTitle: this.sectionTitle,
          id: this.generateLessonId(),
        });

        this.disableMenu();
      }
    },

    setLesson(lessonTitle, previousTitle) {
      this.$store.dispatch('sectionStore/setPreviousTitle', previousTitle);
      this.$store.dispatch('sectionStore/setLesson', {
        sectionTitle: this.sectionTitle,
        lessonTitle,
      });
    },

    renameLesson(previousTitle) {
      this.setLesson(null, previousTitle);
      this.disableMenu();
    },

    deleteLesson(lessonTitle) {
      this.$store.dispatch('sectionStore/deleteLesson', {
        sectionTitle: this.sectionTitle,
        lessonTitle,
      });
    },

    submitLesson(title) {
      if (this.validateInput(title)) {
        this.db.atomicUpsert({
          previousTitle: this.previousTitle,
          docKey: this.sectionTitle,
          content: {
            lessons: {
              title,
              id: this.lessons.null.id,
            },
          },
          changeFn: (oldData) => {
            const previousLessonIndex = this.findLessonIndex(oldData.lessons, this.previousTitle);

            oldData.lessons[previousLessonIndex].title = title;

            return oldData;
          },
        }).then(() => this.setLesson(title, null));
      } else {
        this.deleteLesson(null);
      }

      this.enableMenu();
    },

    deleteLessonFromDb(title) {
      this.db.atomicUpdate(this.sectionTitle, (oldData) => {
        const lessonIndex = this.findLessonIndex(oldData.lessons, title);

        oldData.lessons[lessonIndex] = null;
        return oldData;
      }).then(() => this.deleteLesson(title));
    },

    deleteUnSubmittedLesson() {
      if (this.isUnSubmittedLessonExists) {
        this.deleteLesson(null);
        this.enableMenu();
      }
    },

    menuItems(lessonTitle) {
      return [
        new MenuItem('Rename', this.renameLesson, [lessonTitle]),
        new MenuItem('Delete', this.deleteLessonFromDb, [lessonTitle]),
      ];
    },

    findLessonIndex(lessons, title) {
      return lessons.findIndex((lesson) => {
        if (lesson !== null) {
          return lesson.title === title;
        }

        return false;
      });
    },

    validateInput(title) {
      return title !== '' && this.lessons[title] === undefined;
    },

    generateLessonId() {
      return Math.random().toString(36).substr(2, 9);
    },

    enableMenu() {
      this.$store.dispatch('menuStore/enableMenu');
    },

    disableMenu() {
      this.$store.dispatch('menuStore/disableMenu');
    },
  },

  computed: {
    ...mapState('sectionStore', {
      lessons: (state) => state.lessons,
      previousTitle: (state) => state.previousTitle,
    }),

    ...mapGetters('sectionStore', {
      getLessons: 'getLessons',
    }),

    isUnSubmittedLessonExists() {
      return Object.prototype.hasOwnProperty.call(this.lessons, 'null');
    },
  },

  props: {
    dialogTitle: String,
  },

  components: { LessonCard },
};
</script>

<style lang="scss" scoped>
.empty-lesson-card {
  display: inline-block;
  min-width: 150px;
  max-width: 500px;
  height: 110px;
  margin: 15px;
  border-radius: 15px;
  border: 0.15rem dashed $positive;
  background-color: #464646;
  cursor: pointer;
  user-select: none;
}

.empty-lesson-card__icon {
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: $positive;
  cursor: pointer;
}
</style>
