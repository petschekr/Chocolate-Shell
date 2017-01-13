const Terminal = require("xterm");
const {ipcRenderer} = require("electron");
const crypto = require("crypto");

const Connection = require("./connection");
const {Tab} = require("./tabmanager");az

class NewConnection extends Tab {
    constructor() {
        super("New Connection");

        var terminalContainer = document.createElement("div");
		terminalContainer.classList.add("newconnection-container");
		terminalContainer.id = this.id;
        
        // Load from template
        var newConnectionTemplate = document.getElementById("newconnection");
        var newConnectionContent = document.importNode(newConnectionTemplate.content, true);
        terminalContainer.appendChild(newConnectionContent);
        
        // Set up event handlers
        undefined;
		
        document.querySelector("section.content").appendChild(terminalContainer);
        window.mdc.autoInit();
    }
    close() {
        return !confirm("Changes not saved!");
    }
}

module.exports = NewConnection;