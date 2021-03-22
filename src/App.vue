<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import DatabaseApi, { SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';
import { writeBackup } from 'components/utils/fsApi';

export default {
  name: 'App',

  created() {
    setInterval(() => {
      writeBackup();
    }, 1_500_000);

    this.$store.dispatch('sectionStore/fetchSections',
      new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY).findAllDocs().then((docs) => docs));
  },
};
</script>
