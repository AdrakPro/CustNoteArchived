<template>
  <q-menu
    v-show="menuItems !== undefined"
    context-menu
    anchor="bottom left"
    self="top left"
    auto-close
  >
    <q-item
      v-for="item in menuItems"
      :key="item.itemTitle"
      :disable="isMenuDisabled"
      @click="item.executeFn(...item.executeFnParams)"
      clickable
    ><div>{{ item.itemTitle }}</div>
    </q-item>
  </q-menu>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Menu',

  computed: {
    ...mapState('menuStore', {
      isMenuDisabled: (state) => state.isMenuDisabled,
    }),
  },

  props: {
    menuItems: Array,
  },
};
</script>

<style>
.q-menu {
  background-color: transparent;
}
</style>
