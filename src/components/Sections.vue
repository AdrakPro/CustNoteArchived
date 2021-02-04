<template>
  <div class="section__parent">
    <div class="section">
      <q-input
        v-if="sectionTitle === null"
        class="section-title__input"
        v-model="sectionTitleInput"
        @keydown.enter="submitSectionTitleInput"
        autofocus
        borderless
      />
      <div
        v-else
        class="section__text"
        @click="openDialog"
      >{{ sectionTitle }}
        <Menu :menu-items="createMenuItems(this.sectionTitle)" />
      </div>
    </div>
    <div
      class="wrap row"
      ref="lessonsDiv"
    >
      <LessonCard
        v-for="lesson in lessons"
        :key="lesson.lessonTitle"
        :lesson-title="lesson.lessonTitle"
      />
    </div>
    <Dialog
      :show-dialog.sync="showLessonsDialog"
      :dialog-title="sectionTitle"
      :dialog-content="lessons"
      content-component-name="LessonsDialog"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DatabaseApi, { SECTIONS_NAME, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import LessonCard from 'components/LessonCard';
import Dialog from 'components/dialogs/GenericDialog';
import Menu from 'components/Menu';

export default {
  name: 'Sections',

  data() {
    return {
      db: null,
      sectionTitleInput: '',
      showLessonsDialog: false,
      isRenaming: false,
    };
  },

  created() {
    this.db = new DatabaseApi(SECTIONS_NAME, SECTIONS_PRIMARY_KEY);
  },

  methods: {
    submitSectionTitleInput() {
      const sectionKey = this.getSectionKey(this.getSectionIndex(null));

      if (this.api.validateInput(this.sectionTitleInput, (section) => section.sectionTitle === this.sectionTitleInput)) {
        this.$store.dispatch('sectionStore/setSectionTitle', {
          sectionTitle: this.sectionTitleInput,
          sectionKey,
        });

        if (this.previousTitle === null) {
          this.db.insertDoc({
            sectionTitle: this.sectionTitleInput,
          });
        } else {
          this.db.updateDoc(this.previousTitle, {
            $set: {
              sectionTitle: this.sectionTitleInput,
            },
          });
        }

        this.$store.dispatch('sectionStore/setPreviousTitle', null);
      } else {
        this.deleteSection(sectionKey);
      }

      this.$store.dispatch('sectionStore/enableMenu');

      this.rerenderSections();
    },

    deleteSection(sectionKey) {
      this.db.deleteDoc(sectionKey);
      this.$store.dispatch('sectionStore/deleteSection', sectionKey);

      this.rerenderSections();
    },

    renameSection(sectionKey) {
      this.$store.dispatch('sectionStore/disableMenu');
      this.$store.dispatch('sectionStore/setPreviousTitle', this.sections[sectionKey].sectionTitle);
      this.$store.dispatch('sectionStore/setSectionTitle', {
        sectionTitle: null,
        sectionKey,
      });

      this.rerenderSections();
    },

    createMenuItems(sectionTitle) {
      const sectionKey = this.getSectionKey(this.getSectionIndex(sectionTitle));

      return [
        {
          itemTitle: 'Delete section',
          executeFunc: this.deleteSection,
          executeFuncParams: [sectionKey],
        },
        {
          itemTitle: 'Rename section',
          executeFunc: this.renameSection,
          executeFuncParams: [sectionKey],
        },
      ];
    },

    rerenderSections() {
      this.$emit('rerenderSections');
    },

    getSectionIndex(sectionTitle) {
      return this.api.getObjectIndex((section) => section.sectionTitle === sectionTitle);
    },

    getSectionKey(sectionIndex) {
      return this.api.getObjectKey(sectionIndex);
    },

    openDialog() {
      this.showLessonsDialog = true;
    },

    closeDialog() {
      this.showLessonsDialog = false;
    },
  },

  computed: {
    ...mapState('sectionStore', {
      sections: (state) => state.sections,
      previousTitle: (state) => state.previousTitle,
    }),
  },

  props: {
    sectionTitle: String,
    lessons: Array,
    api: Object,
  },

  components: { Menu, Dialog, LessonCard },
};
</script>

<style lang="scss">
.section__parent {
  margin-bottom: 3vh;
}

.section {
  text-align: center;
  height: 30px;
  width: 100%;
  border-bottom-left-radius: 50vw;
  border-bottom-right-radius: 50vw;
  background-color: #434c43;
}

.section__text {
  margin: 0;
  padding-top: 2px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  color: #52D273;
}

.section-title__input input {
  height: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #52D273;
}
</style>
