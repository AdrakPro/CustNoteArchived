<template>
  <q-layout view="LHh lpR lFf">
    <q-header class="tool-bar__header shadow-3">
      <q-btn-group class="full-height" spread unelevated>
        <q-btn
          class="tool-bar__button"
          @click="$router.push('/')"
        >Notes</q-btn>
        <q-btn class="tool-bar__button">Articles</q-btn>
        <q-btn class="tool-bar__button">Exercises</q-btn>
        <q-btn class="tool-bar__button">Settings</q-btn>
      </q-btn-group>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

</script>

<style lang="scss" scoped>
.tool-bar__header {
  height: 51px;
  font-weight: bold;
  background-color: #333333;
}

.tool-bar__button {
  font-weight: bold;
  color: #52D273;
}

</style>
