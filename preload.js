const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveDiagram: (json) => ipcRenderer.invoke('save-dialog', json),
  loadDiagram: () => ipcRenderer.invoke('open-dialog')
});
