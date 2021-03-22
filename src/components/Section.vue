<template>
  <div class="section">
    <div class="section-header">
      <q-input
        v-if="section.sectionTitle === null"
        v-model="sectionTitleInput"
        @keydown.enter="submitSectionTitle"
        class="section__input"
        autofocus
        borderless
      />
      <div
        v-else
        @click="openDialog"
        class="section-header__text"
      >{{ section.sectionTitle }}
        <Menu :menu-items="createMenuItems" />
      </div>
    </div>
    <div class="wrap row">
      <LessonCard
        v-for="lessonTitle in section.lessons"
        :key="lessonTitle"
        :lesson="lessons[lessonTitle]"
      />
    </div>
    <Dialog
      :show-dialog.sync="showLessonDialog"
      :dialog-title="section.sectionTitle"
      content-component-name="LessonDialog"
      @closeDialog="closeDialog"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DatabaseApi, { SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import MenuItem from 'components/models/menuItem';
import LessonCard from 'components/LessonCard';
import Dialog from 'components/dialogs/GenericDialog';
import Menu from 'components/Menu';

export default {
  name: 'Section',

  data() {
    return {
      sectionTitleInput: '',
      showLessonDialog: false,
    };
  },

  methods: {
    /* Triggers when enter is pressed on q-input, validate input, persist data to store and db */
    submitSectionTitle() {
      if (this.validateInput()) {
        const sectionTitle = {
          sectionTitle: this.sectionTitleInput,
        };

        if (this.previousTitle === null) {
          this.db.insertDoc(sectionTitle);
        } else {
          this.db.updateDoc(this.previousTitle, {
            $set: sectionTitle,
          });
        }

        this.$store.dispatch('sectionStore/setPreviousTitle', null);
        this.$store.dispatch('sectionStore/setSection', this.sectionTitleInput);
      } else {
        this.deleteSection();
      }

      this.$store.dispatch('menuStore/enableMenu');
    },

    /* Delete section from store and db using it's key */
    deleteSection() {
      const { sectionTitle } = this.section;

      this.db.deleteDoc(sectionTitle);
      this.$store.dispatch('sectionStore/deleteSection', sectionTitle);
    },

    /* Set sectionTittle to null, triggering submitSectionTitle */
    renameSection() {
      this.$store.dispatch('sectionStore/setPreviousTitle', this.section.sectionTitle);
      this.$store.dispatch('sectionStore/setSection', null);
      this.$store.dispatch('menuStore/disableMenu');
    },

    validateInput() {
      return this.sectionTitleInput !== '' && !this.allSectionKeys.includes(this.sectionTitleInput);
    },

    openDialog() {
      this.showLessonDialog = true;
    },

    closeDialog() {
      this.showLessonDialog = false;
    },
  },

  computed: {
    ...mapState('sectionStore', {
      previousTitle: (state) => state.previousTitle,
      allSectionKeys: (state) => Object.keys(state.sections),
      lessons: (state) => state.lessons,
    }),

    createMenuItems() {
      return [
        new MenuItem('Rename', this.renameSection),
        new MenuItem('Delete', this.deleteSection),
      ];
    },
  },

  props: {
    db: Object,
    section: Object,
  },

  components: { LessonCard, Dialog, Menu },
};
</script>

<style lang="scss">
.section {
  margin-bottom: 2vh;
}

.section-header {
  text-align: center;
  height: 30px;
  width: 100%;
  border-bottom-left-radius: 50vw;
  border-bottom-right-radius: 50vw;
  background-color: #434c43;
}

.section-header__text {
  margin: 0;
  padding-top: 2px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  color: #52D273;
}

.section__input input {
  height: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #52D273;
}
</style>
