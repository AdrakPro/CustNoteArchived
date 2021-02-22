<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import DatabaseApi, { SECTIONS, SECTIONS_PRIMARY_KEY } from 'components/utils/databaseApi';

export default {
  name: 'App',

  created() {
    this.$store.dispatch('sectionStore/fetchSections',
      new DatabaseApi(SECTIONS, SECTIONS_PRIMARY_KEY).findAllDocs().then((docs) => docs));
  },
};
</script>
