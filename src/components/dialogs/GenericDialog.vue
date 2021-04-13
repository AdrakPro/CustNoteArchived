<template>
  <q-dialog
    :value="show"
    persistent
  >
    <div class="dialog">
      <q-bar>
        <q-space />
        <div class=dialog__title>{{ title }}</div>
        <q-space />
        <q-icon
          @click="closeDialog"
          class="dialog__close"
          name="mdi-close"
        />
      </q-bar>
      <div v-if="containerName !== null">
        <keep-alive>
          <component
            :is="contentComponent"
            :dialog-title="title"
          />
        </keep-alive>
      </div>
    </div>
  </q-dialog>
</template>

<script>
export default {
  name: 'GenericDialog',

  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
  },

  computed: {
    contentComponent() {
      const component = import(`components/dialogs/${this.containerName}`);

      return () => component;
    },
  },

  props: {
    title: String,
    containerName: String,
    show: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  width: 90vw;
  max-width: 90vw;
  height: 80vh;
  background-color: #3f4040;
}

.dialog__title {
  font-weight: bold;
  font-size: 20px;
  color: $positive;
}

.dialog__close {
  font-size: 20px;
  cursor: pointer;
  color: $positive;
}
</style>
