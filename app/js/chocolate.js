const Terminal = require("xterm");
const ssh2 = require("ssh2");
const {ipcRenderer} = require("electron");

const {Tab, TabManager} = require("./js/tabmanager.js");
const Session = require("./js/session.js");

var tabManager = new TabManager();
var session = new Session();
tabManager.addTab(session);
tabManager.addTab(new Session());
tabManager.addTab(new Session());