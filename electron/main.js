const { app, BrowserWindow, Menu } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess = null;

function startBackend() {
  const backendPath = path.join(__dirname, "..", "backend");
  backendProcess = spawn(
    "python",
    ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    {
      cwd: backendPath,
      shell: true,
      stdio: "inherit",
    }
  );

  backendProcess.on("error", (error) => {
    console.error("FastAPI 启动失败:", error);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    title: "学习成长中心",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://127.0.0.1:5173");
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  startBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (backendProcess) backendProcess.kill();
});
