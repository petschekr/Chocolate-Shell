const Terminal = require("xterm");
const {ipcRenderer} = require("electron");
const crypto = require("crypto");

const Connection = require("./connection");
const {Tab} = require("./tabmanager");

class Session extends Tab {
	constructor (connectOptions = null) {
		super();
		// Col and row dimensions are set with _proposeGeometry()
		this.terminal = new Terminal({
			cols: 0,
			rows: 0,
			cursorBlink: true
		});
		this.terminal.on("data", this.onData.bind(this));
		this.terminal.on("title", this.onTitleChange.bind(this));
		
		var terminalContainer = document.createElement("div");
		terminalContainer.classList.add("terminal-container");
		terminalContainer.id = this.id;
		document.querySelector("section.content").appendChild(terminalContainer);
		
		this.setActive();
		this.terminal.open(terminalContainer);
		this.resize();
		
		ipcRenderer.on("activity", this.onWindowActivity.bind(this));
	}
	resize () {
		var geometry = this._proposeGeometry();
		this.terminal.resize(geometry.cols, geometry.rows);
		// this.SSH CONNECTION.resize()
	}
	// Events
	onData (data) {
		
	}
	onTitleChange (title) {
		// Change title by sending it through IPC
	}
	onWindowActivity (event, message) {
		// The blur attribute is applied to the container instead of the cursor itself
		// because the cursor is constantly deleted and readded by xterm.js
		var container = document.getElementById(this.id);
		
		if (message === "focus") {
			container.classList.remove("blur");
			this.terminal.startBlink();
			// Let the terminal capture input no matter how the window was focused
			this.terminal.focus();
		}
		if (message === "blur") {
			container.classList.add("blur");
			clearInterval(this.terminal._blink);
			this.terminal.cursorState = 1;
		}
		if (message === "resize") {
			this.resize();
		}
	}
	// From xterm.js' fit addon
	_proposeGeometry () {
		var term = this.terminal;
		var parentElementStyle = window.getComputedStyle(term.element.parentElement),
			parentElementHeight = parseInt(parentElementStyle.getPropertyValue('height')),
			parentElementWidth = parseInt(parentElementStyle.getPropertyValue('width')),
			elementStyle = window.getComputedStyle(term.element),
			elementPaddingVer = parseInt(elementStyle.getPropertyValue('padding-top')) + parseInt(elementStyle.getPropertyValue('padding-bottom')),
			elementPaddingHor = parseInt(elementStyle.getPropertyValue('padding-right')) + parseInt(elementStyle.getPropertyValue('padding-left')),
			availableHeight = parentElementHeight - elementPaddingVer,
			availableWidth = parentElementWidth - elementPaddingHor,
			container = term.rowContainer,
			subjectRow = term.rowContainer.firstElementChild,
			contentBuffer = subjectRow.innerHTML,
			characterHeight,
			rows,
			characterWidth,
			cols,
			geometry;

		subjectRow.style.display = 'inline';
		subjectRow.innerHTML = 'W'; // Common character for measuring width, although on monospace
		characterWidth = subjectRow.getBoundingClientRect().width;
		subjectRow.style.display = ''; // Revert style before calculating height, since they differ.
		characterHeight = parseInt(subjectRow.offsetHeight);
		subjectRow.innerHTML = contentBuffer;

		rows = parseInt(availableHeight / characterHeight);
		cols = parseInt(availableWidth / characterWidth) - 1;

		geometry = { cols: cols, rows: rows };
		return geometry;
	}
}

module.exports = Session;