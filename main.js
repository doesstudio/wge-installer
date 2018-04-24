// Inital app
const { app, BrowserWindow, dialog } = require('electron')
const updater = require("electron-updater");
const autoUpdater = updater.autoUpdater;

let path = require('path')

let win;

///////////////////
// Auto upadater //
///////////////////

autoUpdater.on('checking-for-update', function () {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', function (info) {
    sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', function (info) {
    sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', function (err) {
    sendStatusToWindow('Error in auto-updater.');
});

autoUpdater.on('download-progress', function (progressObj) {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + parseInt(progressObj.percent) + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', function (info) {
    sendStatusToWindow('Update downloaded; will install in 1 seconds');
});

autoUpdater.on('update-downloaded', function (info) {
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 1000);
});

autoUpdater.checkForUpdates();

function sendStatusToWindow(message) {
    console.log(message);
}


function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280, 
    height: 768,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname,'assets/256x256.png'),
    webPreferences: {
      plugins: true,
      webSecurity:false
    }
    // icon: path.join(__dirname,'dist/assets/icons/logo-app-1024.icns') //only for mac
  })

  // win.openDevTools();
  win.loadURL(`file://${__dirname}/app/index.html`)
  // win.loadURL(url.format({ pathname: path.join(__dirname, 'dist/index.html'), protocol: 'file', slashes: true }))
  // win.loadURL(`file://${__dirname}/passenger-list-2018-04-16-all.pdf`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })
}


function printPdf(){
  console.log('printPdf')
}

// Create window on electron intialization
app.on('ready', createWindow)



// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})
