import { ipcRenderer, IpcMessageEvent } from 'electron';
import Watcher from './lib/watcher';

const watcher = new Watcher();

ipcRenderer.on('enable', (event: IpcMessageEvent, enabled) => {
  if (enabled) {
    watcher.enableWatching();
  } else {
    watcher.disableWatching();
  }
});
