// SGT Boost 1.5.3
// It makes no network requests, reads no files and changes nothing on your computer.
const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 980,
    height: 660,
    minWidth: 720,
    minHeight: 520,
    backgroundColor: '#0E1217',
    title: 'SGT Boost',
    icon: path.join(__dirname, 'app', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Block any navigation or new windows; this app never goes online.
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}

function buildMenu() {
  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { label: 'File', submenu: [{ role: 'quit', label: 'Quit SGT Boost' }] },
    { label: 'View', submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }, { role: 'togglefullscreen' }] },
    {
      label: 'Help',
      submenu: [{
        label: 'About SGT Boost',
        click: () => dialog.showMessageBox({
          type: 'info',
          title: 'About SGT Boost',
          message: 'SGT Boost 1.5.3\nStupidly Good Technologies, an FD Corp company',
          detail: 'Stupidly good results. No questions asked.\n\n(This app is part of a story. It stays offline, leaves your files alone, and quits like any normal app.)'
        })
      }]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
