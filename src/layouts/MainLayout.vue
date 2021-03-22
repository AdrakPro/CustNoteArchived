<template>
  <q-layout view="LHh lpR lFf">
    <q-header class="tool-bar__header shadow-3">
      <q-btn-group class="full-height" spread unelevated>
        <q-btn
          class="tool-bar__button"
          @click="redirectToHome"
        >Lessons</q-btn>
        <q-btn class="tool-bar__button">Articles</q-btn>
        <q-btn class="tool-bar__button">Exercises</q-btn>
        <q-btn
          class="tool-bar__button"
          @click="openDialog"
        >Settings</q-btn>
      </q-btn-group>
    </q-header>
    <Dialog
      :show-dialog.sync="showSettingsDialog"
      dialog-title="Settings"
      content-component-name="SettingsDialog"
      @closeDialog="closeDialog"
    />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Dialog from 'components/dialogs/GenericDialog';

export default {
  name: 'MainLayout',

  data() {
    return {
      showSettingsDialog: false,
    };
  },

  methods: {
    redirectToHome() {
      if (this.$router.currentRoute.path !== '/') {
        this.$router.push('/');
      }
    },

    openDialog() {
      this.showSettingsDialog = true;
    },

    closeDialog() {
      this.showSettingsDialog = false;
    },
  },

  components: { Dialog },
};
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
