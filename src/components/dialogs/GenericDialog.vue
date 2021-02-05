<template>
  <q-dialog
    :value="showDialog"
    persistent
  >
    <div class="dialog">
      <q-bar>
        <q-space />
        <div class="dialog-tile">{{ dialogTitle }}</div>
        <q-space />
        <q-icon
          class="dialog-bar__close"
          @click="closeDialog"
          name="close"
          v-close-popup
        />
      </q-bar>
      <div>
        <component
          :is="contentDialogComponent"
          :dialog-title="dialogTitle"
        />
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: 'GenericDialog',

  methods: {
    /* Emit closeDialog to parent component */
    closeDialog() {
      this.$emit('closeDialog');
    },
  },

  computed: {
    /* Get dynamically imported component based on componentName prop /> */
    contentDialogComponent() {
      return () => import(`components/dialogs/${this.contentComponentName}`);
    },
  },

  props: {
    dialogTitle: String,
    contentComponentName: String,
    showDialog: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 90vw;
  width: 90vw;
  height: 80vh;
  background: #3f4040;
}

.dialog-tile {
  font-weight: bold;
  font-size: 20px;
  color: #52D273;
}

.dialog-bar__close {
  font-size: 20px;
  cursor: pointer;
  color: #52D273;
}
</style>
