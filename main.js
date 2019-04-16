const {app, BrowserWindow, Menu} = require('electron');
const path                       = require('path');
const url                        = require('url');
const shell                      = require('electron').shell;
const ipc                        = require('electron').ipcMain;
let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes : true
  }));

  //win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Adjust Notification Value',
          click() {
            const modalPath = path.join('file://', __dirname, 'src/add.html');
            let win         = new BrowserWindow({
              frame      : false,
              transparent: true,
              width      : 400,
              height     : 200,
              alwaysOnTop: true
            });
            win.on('close', function () {
              win = null
            });
            win.loadURL(modalPath);
            win.show()
          }
        },
        {
          label: 'CoinMarketCap',
          click() {
            shell.openExternal('http://coinmarketcap.com');
          }
        },
        {type: 'separator'},
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        },
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});

ipc.on('update-notify-value', function (e, arg) {
  win.webContents.send('targetPriceVal', arg)
});