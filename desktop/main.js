// SGT Boost 1.5.5
// It makes no network requests, reads no files and changes nothing on your computer.
const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

// Running the Windows build through Wine? We see you.
function runningInWine() {
  if (process.platform !== 'win32') return false;
  if (process.env.WINEPREFIX || process.env.WINELOADER || process.env.WINEDEBUG) return true;
  try { if (fs.existsSync('Z:\\etc\\os-release') || fs.existsSync('Z:\\usr\\bin')) return true; } catch (e) {}
  try { execFileSync('reg', ['query', 'HKCU\\Software\\Wine'], { stdio: 'ignore', windowsHide: true, timeout: 3000 }); return true; } catch (e) {}
  return false;
}

async function wineCheck(win) {
  if (!runningInWine()) return;
  const r = await dialog.showMessageBox(win, {
    type: 'info',
    title: 'SGT Boost',
    message: 'We HAVE an official Linux version yk',
    buttons: ['Get the Linux version', 'Stay in Wine'],
    defaultId: 0,
    cancelId: 1
  });
  if (r.response === 0) shell.openExternal('https://stupidlygoodtechnologies.com/#download');
}

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
  return win;
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
          message: 'SGT Boost 1.5.5\nStupidly Good Technologies, an FD Corp company',
          detail: 'Stupidly good results. No questions asked.\n\n(This app is part of a story. It stays offline, leaves your files alone, and quits like any normal app.)'
        })
      }]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  const win = createWindow();
  win.webContents.once('did-finish-load', () => wineCheck(win));
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
