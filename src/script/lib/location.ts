import { homedir } from 'os';
import { Promise } from 'es6-promise';
import { access, mkdir, mkdirSync, rename } from 'fs';
import { extname, dirname, basename, join } from 'path';
import { dialog } from 'electron';
import * as electronconfig from 'electron-config';

const config = new electronconfig();

export default class Location {
  static getNewLocation(path: string) {
    const sortingConfig = config.get('sortingConfig');
    const fileExt = extname(path).toLowerCase();
    let complete = false;
    for (let i = 0; i < Object.keys(sortingConfig).length; i += 1) {
      const folder = Object.keys(sortingConfig)[i];
      if (sortingConfig[folder].includes(fileExt)) {
        complete = true;
        return `${dirname(path)}/${folder}/${basename(path)}`;
      }
    }
    if (!complete) {
      if (config.get('others')) {
        return `${dirname(path)}/${config.get('othersName')}/${basename(path)}`;
      } else {
        return `${dirname(path)}/${basename(path)}`;
      }
    }
  }

  static createFolders(disableSafeCheck = false) {
    return new Promise((resolve, reject) => {
      const otherEnabled = config.get('others');
      const otherName = config.get('othersName');
      const sortDir = config.get('downloadsPath');
      const sortingConfig = config.get('sortingConfig');
      if (sortDir.indexOf(homedir()) === -1 && !disableSafeCheck) {
        reject(Error('Location has to be in users base directory!'));
      } else {
        for (let i = 0; i < Object.keys(sortingConfig).length; i += 1) {
          const name = Object.keys(sortingConfig)[i];
          if (name !== 'others_name') {
            access(`${sortDir}/${name}`, err => {
              if (err) {
                mkdir(`${sortDir}/${name}`, error => {
                  if (error) {
                    reject(error);
                  }
                });
              }
            });
          }
        }
        if (otherEnabled) {
          access(`${sortDir}/${otherName}`, err => {
            if (err) {
              mkdirSync(`${sortDir}/${otherName}`);
            }
          });
        }
        resolve();
      }
    });
  }

  static renameMisc(newName) {
    const oldName = config.get('othersName');
    const directory = config.get('downloadsPath');
    const oldFolder = join(directory, oldName);
    const newFolder = join(directory, newName);
    rename(oldFolder, newFolder, err => {
      if (err) {
        dialog.showErrorBox(
          'Rename Other',
          'I was unable to rename the Other folder, please make sure everything in that folder is closed!'
        );
      } else {
        config.set('othersName', newName);
      }
    });
  }
}
