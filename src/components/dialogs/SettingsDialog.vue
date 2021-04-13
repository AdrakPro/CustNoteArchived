<template>
  <div>
    <q-btn-toggle
      :options="tabs"
      v-model="currentTab"
      text-color="white"
      toggle-text-color="positive"
      spread
    />
    <q-carousel
      v-model="currentTab"
      transition-prev="slide-right"
      transition-next="slide-left"
      animated
      control-color="primary"
      class="carousel"
    >
      <q-carousel-slide
        name="backups"
        class="column no-wrap"
      >
        <BackupTable />
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import BackupTable from 'components/BackupTable';

export default {
  data() {
    return {
      currentTab: 'backups',
      tabs: [
        { label: 'Backups', value: 'backups' },
      ],
    };
  },

  components: { BackupTable },
};
</script>

<style lang="scss">
.carousel {
  background: transparent;
  height: 100%;
}
</style>
