<template>
  <div class="row">
    <q-markup-table
      separator="vertical"
      dense
      flat
    >
      <thead>
      <tr>
        <th>Backup name</th>
        <th>Creation date</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="backup in backups"
        :key="backup.name"
        @dblclick="applyBackup(backup.name)"
      >
        <td>{{ backup.name }}</td>
        <td>{{ backup.birthTime }}</td>
      </tr>
      </tbody>
    </q-markup-table>
    <div class="full-width">
      <q-btn
        @click="createBackup"
        icon="mdi-plus"
        class="q-markup-table__button"
      />
    </div>
  </div>
</template>

<script>
import { getBackups, writeBackup, readBackup } from 'components/utils/fsApi';

export default {
  name: 'BackupTable',

  data() {
    return {
      backups: null,
    };
  },

  created() {
    getBackups().then((backups) => {
      this.backups = backups;
    });
  },

  methods: {
    applyBackup(backupName) {
      readBackup(backupName);
    },

    createBackup() {
      writeBackup();
    },
  },
};
</script>

<style lang="scss">
.q-markup-table {
  width: 100%;
  background-color: $primary;
  color: $white;
  text-align: center;
  user-select: none;

  table th {
    color: $positive;
    font-weight: bold;
  }

  table td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  &__button {
    width: 100%;
    color: $positive;
  }
}

</style>
