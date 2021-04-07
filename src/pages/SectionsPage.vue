<template>
  <q-page class="row">
    <div class="full-width">
      <Section
        v-for="section in sections"
        :key="section.title"
        :section="section"
        :db="db"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import { DatabaseApi, SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import { KeyListener, CTRL_S } from 'components/utils/keyListener';
import Section from 'components/Section';

export default {
  name: 'SectionsPage',

  data() {
    return {
      db: null,
    };
  },

  created() {
    this.db = new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY);
    this.keyListener = new KeyListener();
  },

  mounted() {
    this.keyListener.addKeyListener(CTRL_S, this.createEmptySection, this);
  },

  beforeDestroy() {
    this.keyListener.destroyKeyListener();
  },

  methods: {
    createEmptySection() {
      if (this.isUnSubmittedSectionNotExists) {
        this.$store.dispatch('sectionStore/createEmptySection');
        this.disableMenu();
      }
    },

    disableMenu() {
      this.$store.dispatch('menuStore/disableMenu');
    },
  },

  computed: {
    ...mapState('sectionStore', {
      sections: (state) => state.sections,
    }),

    isUnSubmittedSectionNotExists() {
      return !Object.prototype.hasOwnProperty.call(this.sections, 'null');
    },
  },

  components: { Section },
};
</script>
