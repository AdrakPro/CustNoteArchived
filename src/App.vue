<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { DatabaseApi, SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import { writeBackup } from 'components/utils/fsApi';

export default {
  name: 'App',

  created() {
    this.createGlobalBackupInterval();
    this.fetchSections();
  },

  methods: {
    createGlobalBackupInterval() {
      const thirtyMinutes = 1_800_000;

      setInterval(() => writeBackup(), thirtyMinutes);
    },

    fetchSections() {
      const docs = new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY).findAllDocs().then((docs) => docs);

      this.$store.dispatch('sectionStore/fetchSections', docs);
    },
  },
};
</script>
