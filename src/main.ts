import { app, BrowserWindow, dialog } from 'electron';
import { Rectangle, Event } from 'electron/main';
import pify from 'pify';
import jsonStorage from 'electron-json-storage';
import merge from 'deepmerge';
import configureStore, { RootState, getRootInitialState } from './store';
import { setCountDimensions, setTrackerDimensions } from './stores/settings/actions';

declare var MAIN_WINDOW_WEBPACK_ENTRY: any;
declare var COUNT_WINDOW_WEBPACK_ENTRY: any;

export interface Global extends NodeJS.Global {
  state: RootState,
}

declare var global: Global;

// we have to do this to ease remote-loading of the initial state :(
global.state = getRootInitialState();

const storage = pify(jsonStorage);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

const createCountWindow = (parent: BrowserWindow, store: ReturnType<typeof configureStore>) => {
    // Create the browser window.
  const countWindow = new BrowserWindow({
    parent,
    width: store.getState().settings.dimensions.count.width,
    height: store.getState().settings.dimensions.count.height,
    frame: false,
    resizable: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  countWindow.loadURL(COUNT_WINDOW_WEBPACK_ENTRY);

  countWindow.on('will-resize', (event: Event, newBounds: Rectangle) => {
    store.dispatch(setCountDimensions(newBounds.width, newBounds.height));
  });
}

const createWindow = async () => {
  const loadedState = await storage.get('state');
  const mergedState = merge(getRootInitialState(), loadedState);
  global.state = {
    ...mergedState,
    tracker: {
      ...mergedState.tracker,
      pokemon: loadedState.tracker.pokemon,
    }
  }
  const store = configureStore(global.state, 'main');

  store.subscribe(async () => {
    global.state = store.getState();
    // persist store changes
    await storage.set('state', global.state);
  });
  
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: store.getState().settings.dimensions.tracker.width,
    height: store.getState().settings.dimensions.tracker.height,
    frame: false,
    resizable: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  createCountWindow(mainWindow, store);

  mainWindow.on('will-resize', (event: Event, newBounds: Rectangle) => {
    event.preventDefault();

    const cellSize = store.getState().settings.cellSize;
    const cellsPerRow = Math.floor(newBounds.width / cellSize);
    const maxRows = Math.ceil(store.getState().tracker.pokemon.length / cellsPerRow)

    const newWidth = newBounds.width - (newBounds.width % 48);
    const newHeight = Math.min(newBounds.height - (newBounds.height % 48), maxRows * cellSize);

    mainWindow.setSize(newWidth, newHeight);

    store.dispatch(setTrackerDimensions(newWidth, newHeight));
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  .catch((err) => {
    dialog.showErrorBox('There\'s been an error', err.message);
  });
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
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.