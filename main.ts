import * as path from 'path';
import * as url from 'url';
import {
  app,
  BrowserWindow,
  screen,
  Tray,
  Menu,
  ipcMain,
  dialog,
  IpcMessageEvent
} from 'electron';
import * as electronconfig from 'electron-config';
import * as downloadsfolder from 'downloads-folder';

let tray: Electron.Tray;
let guiWin: Electron.BrowserWindow;
const args = process.argv.slice(1);
let scriptWin: Electron.BrowserWindow;
const serve: boolean = args.some(val => val === '--serve');
const iconPath: string = path.join(__dirname, 'src/favicon.png');
const showScriptWindow: boolean = args.some(val => val === '--scriptWin');

const config = new electronconfig();

if (!config.has('created')) {
  config.store = {
    enabled: true,
    others: false,
    sortingDelay: 10000,
    othersName: 'Misc',
    downloadsPath: path.normalize(downloadsfolder()),
    theme: 'amber-theme',
    sortingConfig: {
      Archives: ['.zip', '.rar', '.7z', '.tar', '.iso', '.bz2', '.gz', '.dmg'],
      Audio: ['.mp3', '.wav', '.3gp', '.m4a', '.ogg'],
      Executables: ['.exe', '.app'],
      'Installer Packages': ['.msi'],
      Pictures: ['.png', '.png', '.svg'],
      Videos: ['.mp4', '.flv']
    },
    ignoredFiles: {
      'Temp Files': '*.tmp',
      'In-Progress Downloads': '*.*download'
    },
    tutorial: {
      enabled: true,
      step: 0
    },
    retryTime: 60000,
    created: true
  };
}

function createWindow() {
  if (!guiWin) {
    const size = screen.getPrimaryDisplay().workAreaSize;
    guiWin = new BrowserWindow({
      x: 0,
      y: 0,
      show: false,
      frame: false,
      icon: iconPath,
      width: size.width / 2,
      height: size.height / 2
    });
    if (serve) {
      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`)
      });
      guiWin.loadURL('http://localhost:4200');
    } else {
      guiWin.loadURL(
        url.format({
          pathname: path.join(__dirname, 'dist/index.html'),
          protocol: 'file:',
          slashes: true
        })
      );
    }

    guiWin.on('closed', () => {
      guiWin = null;
    });

    guiWin.on('ready-to-show', () => {
      guiWin.show();
    });
  }
}

/**
 * Creates a window that handles sorting and keeping the app running
 */
function createScriptWindow() {
  scriptWin = new BrowserWindow({
    show: showScriptWindow
  });
  scriptWin.loadFile(path.join(__dirname, './src/script/index.html'));
  if (showScriptWindow) {
    scriptWin.webContents.openDevTools({
      mode: 'detach'
    });
  }
}

/**
 * Put the app icon in the tray
 */
function putInTray() {
  tray = new Tray(iconPath);
  tray.setToolTip('FineDLSorter');
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Open',
        click: createWindow
      },
      {
        label: 'Exit',
        click: app.quit
      }
    ])
  );
  tray.on('click', createWindow);
}

ipcMain.on('open-folder-dialog', (event: IpcMessageEvent) => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory']
    },
    folders => {
      if (folders) {
        const folder = path.normalize(folders[0]);
        event.sender.send('directory-selected', folder);
        config.set('downloadsPath', folder);
      }
    }
  );
});

try {
  app.on('ready', () => {
    putInTray();
    createScriptWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (guiWin === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
