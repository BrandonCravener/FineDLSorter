import * as electronconifg from 'electron-config';
import * as chokidar from 'chokidar';
import Location from './location';
import Sorter from './sorter';

const config = new electronconifg();

export default class Watcher {
  watcher: chokidar.FSWatcher = null;

  private createWatcher() {
    const directory = config.get('downloadsPath');
    if (!this.watcher) {
      this.watcher = chokidar.watch(directory, {
        ignored: this.getIgnored(directory),
        persistent: true,
        depth: 0
      });
      this.watcher.on('add', path => {
        setTimeout(() => {
          Sorter.sort(path)
            .then(() => {
              console.log(`File: ${path} sorter`);
            })
            .catch(err => console.error);
        }, config.get('sortingDelay'));
      });
    }
  }

  constructor() {
    this.createWatcher();
  }

  getIgnored(directory: string) {
    const ignoredFiles = [];
    const ignored = config.get('ignoredFiles');
    Object.keys(ignored).forEach(label => {
      ignoredFiles.push(ignored[label]);
    });
    return ignoredFiles;
  }

  addIgnore(rule: string) {
    this.watcher.unwatch(rule);
  }

  watch(rule: string) {
    this.watcher.add(rule);
  }

  enableWatching() {
    Location.createFolders();
    if (this.watcher == null) {
      this.createWatcher();
    }
  }

  disableWatching() {
    this.watcher.close();
    this.watcher = null;
  }
}
