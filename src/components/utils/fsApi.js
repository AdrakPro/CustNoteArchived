import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { exportDb, importDb } from 'boot/database';

const defaultBackupDir = path.join(remote.app.getPath('userData'), 'Backups');

// It is good solution hmmm?
function catchError(err) {
  if (err) {
    throw err;
  }
}

/* Read dir and get JSON backups names */
async function getBackupsNames() {
  return new Promise((resolve, reject) => {
    fs.readdir(defaultBackupDir, (err, files) => {
      if (err) {
        reject();
      } else {
        const jsonFiles = files.filter((fileName) => fileName.includes('.json'));

        resolve(jsonFiles);
      }
    });
  });
}

/* Get backup names and creation dates, sort and return */
async function getBackups() {
  return new Promise((resolve, reject) => {
    const backups = [];

    getBackupsNames().then((backupsNames) => {
      for (let i = 0, l = backupsNames.length; i < l; ++i) {
        fs.stat(path.join(defaultBackupDir, backupsNames[i]), (err, stats) => {
          if (err) {
            reject();
          }

          backups.push({ name: backupsNames[i], birthTime: stats.birthtime.toLocaleString() });
        });
      }

      backups.sort((a, b) => Date.parse(a.birthTime) - Date.parse(b.birthTime));
    });

    resolve(backups);
  });
}

/* If dir doesn't exist, create it. Iterate through files and limit backups to 20 files. At the end write backup to file */
async function writeBackup() {
  const backupPath = path.join(defaultBackupDir, `Backup-${Date.now()}.json`);
  const backupContent = JSON.stringify(await exportDb().then((content) => content));

  await fs.stat(defaultBackupDir, (err) => {
    if (err) {
      fs.mkdir(defaultBackupDir, (err) => catchError(err));
    } else {
      getBackupsNames().then((backupsNames) => {
        if (backupsNames.length > 20) {
          // Delete first file in dir
          fs.unlink(path.join(defaultBackupDir, backupsNames[0]), (err) => catchError(err));
        }

        fs.writeFile(backupPath, backupContent, 'UTF-8', (err) => catchError(err));
      });
    }
  });
}

/* Read JSON file then import database */
function readBackup(backupName) {
  const data = JSON.parse(fs.readFileSync(path.join(defaultBackupDir, backupName)).toString('UTF-8'));

  importDb(data);
}

export {
  writeBackup,
  readBackup,
  getBackups,
};
