const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('save-dialog', async (event, json) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save diagram',
    defaultPath: 'diagram.json',
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ]
  });

  if (filePath) {
    fs.writeFileSync(filePath, json);
  }
});

ipcMain.handle('open-dialog', async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Load diagram',
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ],
    properties: ['openFile']
  });

  if (filePaths && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return content;
  }
});
