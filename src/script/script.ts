import Watcher from './lib/watcher';
import { ipcRenderer, IpcMessageEvent } from 'electron';
import * as electronconfig from 'electron-config';

const watcher = new Watcher();
const config = new electronconfig();

function handleEnable(enabled) {
  if (enabled) {
    watcher.enableWatching();
  } else {
    watcher.disableWatching();
  }
}

handleEnable(config.get('enabled'));
ipcRenderer.on('enable', (event: IpcMessageEvent, enabled) => {
  handleEnable(enabled);
});
