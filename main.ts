import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, screen, Tray, Menu, ipcMain } from 'electron';


let tray: Electron.Tray;
let guiWin: Electron.BrowserWindow;
const args = process.argv.slice(1);
let scriptWin: Electron.BrowserWindow;
const serve: boolean = args.some(val => val === '--serve');
const iconPath: string = path.join(__dirname, 'src/favicon.png');
const showScriptWindow: boolean = args.some(val => val === '--scriptWin');

function createWindow() {
  if (!guiWin) {
    const size = screen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    guiWin = new BrowserWindow({
      x: 0,
      y: 0,
      show: false,
      frame: false,
      icon: iconPath,
      width: size.width / 3,
      height: size.height / 3
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

    // Emitted when the window is closed.
    guiWin.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
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

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    putInTray();
    createScriptWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (guiWin === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
