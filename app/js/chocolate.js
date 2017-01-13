const Terminal = require("xterm");
const ssh2 = require("ssh2");
const {ipcRenderer} = require("electron");

const {Tab, TabManager} = require("./js/tabmanager.js");
const Session = require("./js/session.js");
const NewConnection = require("./js/newconnection.js");

var tabManager = new TabManager();
tabManager.addTab(new NewConnection());