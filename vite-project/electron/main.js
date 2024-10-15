import { app, BrowserWindow, Menu } from "electron";
const path = require('path');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path.join(__dirname, "../dist", "index.html");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('use-angle', 'swiftshader');  // 使用 SwiftShader 软件渲染

app.commandLine.appendSwitch('disable-features', 'Autofill');
app.commandLine.appendSwitch('disable-features', 'AutofillServerCommunication');


const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1300,
        height: 720,
        frame: true,
        webPreferences: {
            disableHtmlFullscreenWindowResize: true,
            spellcheck: false,  // 禁用拼写检查，可能帮助减少自动填充相关错误
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
        }
    });
    Menu.setApplicationMenu(null);
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(url);
        // 打开控制台
        win.webContents.openDevTools();
    } else {
        win.loadFile(indexHtml);
    }

    // 禁用 HTML 表单的自动填充
    win.webContents.on('dom-ready', () => {
        win.webContents.executeJavaScript(`
            document.querySelectorAll('input, textarea').forEach(element => {
                element.setAttribute('autocomplete', 'off');
            });
        `);
    });
};

// 创建窗口
app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// 关闭窗口
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
