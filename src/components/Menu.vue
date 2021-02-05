<template>
  <q-menu
    v-show="menuItems !== undefined"
    fit
    anchor="bottom left"
    self="top left"
    context-menu
  >
    <q-item
      v-for="item in menuItems"
      :key="item.itemTitle"
      :disable="isMenuDisabled"
      @click="item.executeFunc(...item.executeFuncParams)"
      clickable
    >
      <q-item-section>{{ item.itemTitle }}</q-item-section>
    </q-item>
  </q-menu>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Menu',

  created() {
    console.log(this.isMenuDisabled);
  },

  computed: {
    ...mapState('sectionStore', {
      isMenuDisabled: (state) => state.isMenuDisabled,
    }),
  },

  props: {
    menuItems: Array,
  },
};
</script>

<style>

</style>
