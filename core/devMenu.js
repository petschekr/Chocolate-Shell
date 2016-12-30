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
            accelerator: "Ctrl+R",
            click: function () {
                BrowserWindow.getFocusedWindow().reload();
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