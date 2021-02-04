<template>
  <q-page class="row">
    <div
      class="full-width"
      :key="sectionsDivIndex"
    >
      <Sections
        v-for="section in sections"
        :key="section.sectionTitle"
        :section-title="section.sectionTitle"
        :lessons="section.lessons"
        :api="api"
        @rerenderSections="rerenderSections"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import Api from 'components/utils/api';
import KeyListener from 'components/utils/keyListener';
import Sections from 'components/Sections';

export default {
  name: 'SectionsPage',

  data() {
    return {
      sectionsDivIndex: 0,
      keyListener: null,
      api: null,
    };
  },

  created() {
    this.keyListener = new KeyListener();
    this.api = new Api(this.sections);
  },

  mounted() {
    this.keyListener.addKeyListener('s', this.createSection, this);
  },

  beforeDestroy() {
    this.keyListener.destroyKeyListener();
  },

  methods: {
    createSection() {
      if (!this.api.isObjectHasNullField('sectionTitle')) {
        this.$store.dispatch('sectionStore/disableMenu');

        this.$store.dispatch('sectionStore/createEmptySection', {
          sectionKey: this.api.createUniqueKey(),
          section: {
            sectionTitle: null,
            lessons: [],
          },
        });

        this.rerenderSections();
      }
    },

    rerenderSections() {
      this.sectionsDivIndex += 1;
    },
  },

  computed: {
    ...mapState('sectionStore', {
      sections: (state) => state.sections,
    }),
  },

  components: { Sections },
};
</script>
