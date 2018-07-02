// This is free and unencumbered software released into the public domain.
// See LICENSE for details

const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const log = require('electron-log');
const PDFWindow = require('electron-pdf-window')
const {autoUpdater} = require("electron-updater");
let path = require('path')
const base64 = require('base64topdf');
const FileBin = require('file-bin');
//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = true ;
autoUpdater.autoInstallOnAppQuit = true;
log.info('App starting...');

//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}


//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
function sendProgressToWindow(speed,percent,transferred,total){
  win.webContents.send('progress', percent);
}
var updateChecker;
function createPrintingWindow(){
  // const win = new PDFWindow({
  //   width: 800,
  //   height: 600
  // })
 
  // win.loadURL("file://" + __dirname + "/app/transport-arrangement-2018-04-20-all.pdf")
  // win.hide(); // hide when print not call
}
function createDefaultWindow() {
    win = new BrowserWindow({
    width: 1280, 
    height: 800,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname,'assets/favicon.ico'),
    webPreferences: {
      plugins: true,
      webSecurity:false
    }
  });
  // win.webContents.openDevTools();
  printVersion(app.getVersion())

  updateChecker = setInterval(function(){
    console.log('update check')
    autoUpdater.checkForUpdatesAndNotify();
  }, 10000)

  // learInterval(myTimer);


  win.on('closed', () => {
    win = null;
  });

  win.loadURL(`file://${__dirname}/app/index.html`);
  return win;
}

function printVersion(version){
  // app.getVersion()

  win.webContents.send('version', version);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
  printVersion(app.getVersion())
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
  console.log(info);
  printVersion(app.getVersion())
  // win = new BrowserWindow();
  // win.webContents.openDevTools();
})



autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
  console.log(info);
  printVersion(app.getVersion())
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  clearInterval(updateChecker);
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
  sendProgressToWindow(progressObj.bytesPerSecond,progressObj.percent,progressObj.transferred,progressObj.total)
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall(); 
});
app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
  createPrintingWindow();
  autoUpdater.checkForUpdatesAndNotify();
  setInterval(function(){
    // printVersion(app.getVersion())
    // console.log('alert')

  },6000)

});
app.on('window-all-closed', () => {
  app.quit();
});

//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdatesAndNotify();
  // setInterval(function(){
  //   autoUpdater.checkForUpdatesAndNotify();
  // }, 6000)

  // workerWindow = new BrowserWindow();
  // // workerWindow.loadURL("file://" + __dirname + "/app/printerWindow.html");
  // workerWindow.loadURL("file://" + __dirname + "/app/transport-arrangement-2018-04-20-all.pdf");
  // `file://${__dirname}/app/index.html` transport-arrangement-2018-04-20-all.pdf
  // console.log("file://" + __dirname + "/printerWindow.html")
  // workerWindow.hide();
// });

// retransmit it to workerWindow
ipcMain.on("printPDF", function(event, content,filename){
  // console.log('printPDF DONG')
  // win.webContents.send("printPDF", content);
  const win = new PDFWindow({
    width: 800,
    height: 600
  })
  // let fileBin = new FileBin(`./`, ['.md', '.txt','.pdf']);
  // fileBin.write('print.pdf', content)
  //      .then(file => console.log(file));
  let decodedBase64 = base64.base64Decode(content, filename+'.pdf');
//   var fs = require('fs');
// try { 
//   // fs.writeHead({
//   //   'Content-type': 'application/pdf'
//   // })
//   fs.writeFileSync('myfile.pdf', content, 'utf-8'); 
// }
// catch(e) { alert('Failed to save the file !'); }     
  win.loadURL(win.loadURL("file://" + __dirname + '/'+filename+'.pdf'))
//   // work
});

// when worker window is ready
ipcMain.on("readyToPrintPDF", (event) => {
  workerWindow.webContents.print({silent: false});
})


//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();  
// })
