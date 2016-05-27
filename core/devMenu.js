"use strict";

const electron = require("electron");
const {app} = electron;
const {Menu} = electron;
const {BrowserWindow} = electron;

module.exports.setDevMenu = function () {
    var devMenu = Menu.buildFromTemplate([{
        label: "Development",
        submenu: [{
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click: function () {
                BrowserWindow.getFocusedWindow().reloadIgnoringCache();
            }
        },{
            label: "Toggle DevTools",
            accelerator: "Alt+CmdOrCtrl+I",
            click: function () {
                BrowserWindow.getFocusedWindow().toggleDevTools();
            }
        },{
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: function () {
                app.quit();
            }
        }]
    }]);
    Menu.setApplicationMenu(devMenu);
};