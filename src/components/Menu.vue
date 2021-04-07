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
      :key="item.text"
      :disable="isMenuDisabled"
      @click="item.executeFn(...item.executeFnParams)"
      clickable
    ><div>{{ item.text }}</div>
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

<style lang="scss">
.q-menu {
  background-color: transparent;
}

.q-item {
  display: table;
  background-color: $primary;
  width: 130px;
  color: $positive;
  user-select: none;
}

.q-item div {
  display: table-cell;
  vertical-align: middle;
  font-size: 14px;
}
</style>
