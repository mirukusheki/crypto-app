const electron      = require('electron');
const path          = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios         = require('axios');
const ipc           = electron.ipcRenderer;

const notifyBtn = document.getElementById('notifyBtn');
let price       = document.querySelector('h1');
let targetPrice = document.getElementById('targetPrice');
let targetPriceVal;

const notification = {
  title: 'BTC Alert',
  body : 'BTC just beat your target price!',
  icon : path.join(__dirname, "../assets/btc.png")
};

function getBTC() {
  axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
       .then(res => {
         const cryptos   = res.data.BTC.USD;
         price.innerHTML = '$' + cryptos.toLocaleString('en');
         if (targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD) {
           const myNotification = new window.Notification(notification.title, notification);
           console.log(notification.title)
         }
       })
}

getBTC();
setInterval(function () {
  getBTC();
}, 30000);

notifyBtn.addEventListener('click', function (e) {
  const modalPath = path.join('file://', __dirname, 'add.html');
  let win         = new BrowserWindow({frame: false, transparent: true, width: 400, height: 200, alwaysOnTop: true});
  win.on('close', function () {
    win = null
  });
  win.loadURL(modalPath);
  win.show()
});

ipc.on('targetPriceVal', function (e, arg) {
  targetPriceVal        = Number(arg);
  targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')
});