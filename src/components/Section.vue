<template>
  <div class="section">
    <div class="section-header">
      <q-input
        v-if="section.title === null"
        v-model="titleInput"
        @keydown.enter="submitSection"
        class="section__input"
        autofocus
        borderless
      />
      <div
        v-else
        @click="dialog.openDialog({ title: section.title, containerName: 'LessonDialog' })"
      >{{ section.title }}
        <Menu :menu-items="menuItems" />
      </div>
    </div>
    <div class="wrap row">
      <LessonCard
        v-for="title in section.lessons"
        :key="title"
        :lesson="lessons[title]"
      />
    </div>
    <Dialog
      :show="dialog.show"
      :title="dialog.title"
      :container-name="dialog.containerName"
      @closeDialog="dialog.closeDialog()"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MenuItem from 'components/models/menuItem';
import DialogModel from 'components/models/dialogModel';
import LessonCard from 'components/LessonCard';
import Menu from 'components/Menu';
import Dialog from 'components/dialogs/GenericDialog';

export default {
  name: 'Section',

  data() {
    return {
      titleInput: '',
      dialog: new DialogModel(),
    };
  },

  methods: {
    setSection(title, previousTitle) {
      this.$store.dispatch('sectionStore/setPreviousTitle', previousTitle);
      this.$store.dispatch('sectionStore/setSection', title);
    },

    deleteSection() {
      const { title } = this.section;

      this.db.deleteDoc(title);
      this.$store.dispatch('sectionStore/deleteSection', title);
    },

    submitSection() {
      if (this.validateInput()) {
        const content = {
          title: this.titleInput,
        };

        this.db.upsertDoc(this.previousTitle, content)
          .then(() => this.setSection(content.title, this.previousTitle));
      } else {
        this.deleteSection();
      }

      this.enableMenu();
    },

    renameSection() {
      this.setSection(null, this.section.title);
      this.disableMenu();
    },

    validateInput() {
      return this.titleInput !== '' && !this.sectionKeys.includes(this.titleInput);
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
      sectionKeys: (state) => Object.keys(state.sections),
      lessons: (state) => state.lessons,
      previousTitle: (state) => state.previousTitle,
    }),

    menuItems() {
      return [
        new MenuItem('Rename', this.renameSection),
        new MenuItem('Delete', this.deleteSection),
      ];
    },
  },

  props: {
    section: Object,
    db: Object,
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

.section-header > div {
  margin: 0;
  padding-top: 2px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  cursor: pointer;
  color: $positive;
}

.section__input input {
  height: 30px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: $positive;
}
</style>
