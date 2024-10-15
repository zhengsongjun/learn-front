"use strict";
const electron = require("electron");
const path = require("path");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(__dirname, "../dist", "index.html");
electron.app.disableHardwareAcceleration();
electron.app.commandLine.appendSwitch("use-angle", "swiftshader");
electron.app.commandLine.appendSwitch("disable-features", "Autofill");
electron.app.commandLine.appendSwitch("disable-features", "AutofillServerCommunication");
const createWindow = async () => {
  const win = new electron.BrowserWindow({
    width: 1300,
    height: 720,
    frame: true,
    webPreferences: {
      disableHtmlFullscreenWindowResize: true,
      spellcheck: false,
      // 禁用拼写检查，可能帮助减少自动填充相关错误
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false
    }
  });
  electron.Menu.setApplicationMenu(null);
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("dom-ready", () => {
    win.webContents.executeJavaScript(`
            document.querySelectorAll('input, textarea').forEach(element => {
                element.setAttribute('autocomplete', 'off');
            });
        `);
  });
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
