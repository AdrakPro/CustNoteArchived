<template>
  <q-layout view="LHh lpR lFf">
    <q-header class="tool-bar__header shadow-3">
      <q-btn-group
        class="navigation full-height"
        spread
        unelevated
      >
        <q-btn
          label="Lessons"
          @click="redirectToSections"
        />
        <q-btn
          label="Session timer"
          @click="dialog.openDialog({ title: 'Session timer', containerName: 'SessionTimerDialog' })"
        />
        <q-btn
          label="Settings"
          @click="dialog.openDialog({ title: 'Settings', containerName: 'SettingsDialog' })"
        />
      </q-btn-group>
    </q-header>
    <Dialog
      :show="dialog.show"
      :title="dialog.title"
      :container-name="dialog.containerName"
      @closeDialog="dialog.closeDialog()"
    />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Dialog from 'components/dialogs/GenericDialog';
import DialogModel from 'components/models/dialogModel';

export default {
  name: 'MainLayout',

  data() {
    return {
      dialog: new DialogModel(),
    };
  },

  methods: {
    redirectToSections() {
      if (this.$router.currentRoute.path !== '/') {
        this.$router.push('/');
      }
    },
  },

  components: { Dialog },
};
</script>

<style lang="scss">
.tool-bar__header {
  height: 51px;
  font-weight: bold;
  background-color: $dark;
}

.navigation > button[type="button"] {
  font-weight: bold;
  color: $positive;
}
</style>
