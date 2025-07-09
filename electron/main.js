import { app, BrowserWindow, screen } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

const isDev = !!process.env.VITE_DEV_SERVER_URL;
const productMode = process.env.VITE_PRODUCT_MODE || "kiosk";

const isFullscreen = !isDev || productMode === "kiosk";
  const iconPath = path.join(
    process.env.APP_ROOT,
    "assets",
    "icons",
    `${productMode}.ico`
  );

  win = new BrowserWindow({
    icon: iconPath,
    width: isFullscreen ? width : 1200,
    height: isFullscreen ? height : 800,
    fullscreen: isFullscreen,
    kiosk: isFullscreen,
    autoHideMenuBar: isFullscreen,
    resizable: !isFullscreen,
    maximizable: !isFullscreen,
    minimizable: !isFullscreen,
    closable: !isFullscreen,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Disable right-click context menu for kiosk mode
  if (isFullscreen) {
    win.webContents.on("context-menu", (e) => {
      e.preventDefault();
    });

    // Disable F11, F12, and other function keys
    win.webContents.on("before-input-event", (event, input) => {
      if (
        input.key === "F11" ||
        input.key === "F12" ||
        (input.control && input.shift && input.key === "I") ||
        (input.control && input.shift && input.key === "C") ||
        (input.control && input.key === "r") ||
        input.key === "F5"
      ) {
        event.preventDefault();
      }
    });
  }

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
});
