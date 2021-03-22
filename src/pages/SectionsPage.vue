<template>
  <q-page class="row">
    <div class="full-width">
      <Section
        v-for="section in sections"
        :key="section.sectionTitle"
        :section="section"
        :db="db"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import DatabaseApi, { SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import KeyListener, { CTRL_S_KEY } from 'components/utils/keyListener';
import Section from 'components/Section';

export default {
  name: 'SectionsPage',

  data() {
    return {
      db: null,
      keyListener: null,
    };
  },

  created() {
    this.db = new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY);
    this.keyListener = new KeyListener();
  },

  mounted() {
    this.keyListener.addKeyListener(CTRL_S_KEY, this.createSection, this);
  },

  beforeDestroy() {
    this.keyListener.destroyKeyListener();
  },

  methods: {
    /* If sections have not got null field, create dummy object to trigger q-input */
    createSection() {
      if (!this.isSectionsHaveNullField()) {
        this.$store.dispatch('menuStore/disableMenu');
        this.$store.dispatch('sectionStore/createEmptySection');
      }
    },

    isSectionsHaveNullField() {
      return Object.prototype.hasOwnProperty.call(this.sections, 'null');
    },
  },

  computed: {
    ...mapState('sectionStore', {
      sections: (state) => state.sections,
    }),
  },

  components: { Section },
};
</script>
