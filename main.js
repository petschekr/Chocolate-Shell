"use strict";

const electron = require("electron");
const {app} = electron;
const {BrowserWindow} = electron;

const windowStateKeeper = require("./core/windowStateKeeper.js");
const devMenu = require("./core/devMenu.js");

let window = null;
let mainWindowState = windowStateKeeper("main", {
	"width": 1000,
	"height": 660
});

function createWindow() {
	window = new BrowserWindow({
		"x": mainWindowState.x,
		"y": mainWindowState.y,
		"width": mainWindowState.width,
		"height": mainWindowState.height,
		"center": true,
		"min-width": 800,
		"min-height": 400,
		"title": "Chocolate Shell"
	});
	if (mainWindowState.isMaximized) {
        window.maximize();
    }

	window.loadURL(`file://${__dirname}/app/index.html`);

	const development = true;
	if (development) {
		devMenu.setDevMenu();
		window.openDevTools();
	}
	else {
		window.setMenu(null);
	}

	// Handle events for the main window
	window.on("blur", () => {
		window.webContents.send("activity", "blur");
	});
	window.on("focus", () => {
		window.webContents.send("activity", "focus");
	});
	let resizeTimer = null;
	window.on("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			window.webContents.send("activity", "resize");
		}, 500);
	});
	window.on("close", () => {
		mainWindowState.saveState(window);
	});
	window.on("closed", () => {
		window = null;
	});
}
app.on("ready", createWindow);


// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// OS X is special
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X, re-create a window then the app is clicked in the dock without an open window
	if (window === null) {
		createWindow();
	}
});