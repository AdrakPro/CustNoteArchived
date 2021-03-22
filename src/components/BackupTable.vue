<template>
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
      @dblclick="restoreBackup(backup.name)"
    >
      <td>{{ backup.name }}</td>
      <td>{{ backup.birthTime }}</td>
    </tr>
    </tbody>
  </q-markup-table>
</template>

<script>
import { getBackups, readBackup } from 'components/utils/fsApi';

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
    restoreBackup(backupName) {
      readBackup(backupName);
    },
  },
};
</script>

<style lang="scss">
.q-markup-table {
  width: 100%;
  background-color: #484848;
  color: #e8e6e3;
  text-align: center;

  table th {
    color: #52D273;
    font-weight: bold;
  }

  table td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
}

</style>
