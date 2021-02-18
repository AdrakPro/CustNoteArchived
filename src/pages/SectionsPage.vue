<template>
  <q-page class="row">
    <div
      class="full-width"
      :key="sectionsDivIndex"
    >
      <Section
        v-for="section in sections"
        :key="section.sectionTitle"
        :section="section"
        @rerenderSections="rerenderSections"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import KeyListener, { CTRL_S_KEY } from 'components/utils/keyListener';
import Section from 'components/Section';

export default {
  name: 'SectionsPage',

  data() {
    return {
      keyListener: null,
      sectionsDivIndex: 0,
    };
  },

  created() {
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
        this.rerenderSections();
      }
    },

    /* Increase div index to force rerender */
    rerenderSections() {
      this.sectionsDivIndex += 1;
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
