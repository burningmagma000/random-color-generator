const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const packageJson = require("./package.json");

if (process.platform === "darwin")
{
  app.setName("Random Color Generator");
}

ipcMain.on("can-unload", (event) =>
{
  event.returnValue = false;
});

function createWindow()
{
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setMenuBarVisibility(false);

  win.loadFile("index.html", {
    query: { version: packageJson.version }
  });

  win.on("closed", () =>
  {
    app.quit();
  });

  win.webContents.on("before-input-event", (event, input) =>
  {
    const isRefresh =
      (input.control && input.key.toLowerCase() === "r") ||
      (input.meta && input.key.toLowerCase() === "r") ||
      input.key === "F5";

    if (isRefresh)
    {
      event.preventDefault();
    }
  });
}

app.whenReady().then(() =>
{
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: app.name,
        submenu: [
          { role: "quit" }
        ]
      }
    ])
  );
  createWindow();
});

app.on("window-all-closed", () =>
{
  if (process.platform !== "darwin")
  {
    app.quit();
  }
});

app.on("activate", () =>
{
  if (BrowserWindow.getAllWindows().length === 0)
  {
    createWindow();
  }
});