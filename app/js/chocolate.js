const Terminal = require("xterm");
const ssh2 = require("ssh2");
const {ipcRenderer} = require("electron");

const Client = ssh2.Client;
var conn = new Client();

// From xterm.js' fit addon
Terminal.prototype.proposeGeometry = function () {
	var term = this;
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
};

let streamSSH;

conn.on("ready", function () {
	console.log("Client is ready");
	conn.shell({
		cols: term.cols,
		rows: term.rows
	}, function (err, stream) {
		if (err) throw err;
		streamSSH = stream;
		stream.on("close", function () {
			console.log("Stream closed");
			conn.end();
			streamSSH = null;
		}).on("data", function (data) {
			console.log("STDOUT: " + data);
			// Convert from buffer to string values that term.js likes
			term.write(data.toString());
		}).stderr.on("data", function (data) {
			console.log("STDERR: " + data);
			term.write(data.toString());
		});
	});
});

var term = new Terminal({
	cols: 0,
	rows: 0,
	useStyle: true,
	screenKeys: true,
	cursorBlink: true
});

term.on("data", (data) => {
	//term.write(data);
	if (streamSSH) {
		streamSSH.write(data);
	}
	else {
		console.warn("Connection not established!");
	}
});
term.on("title", (title) => {
	// Change title
});

term.open(document.getElementById("terminal-container"));

function resize () {
	var geometry = term.proposeGeometry();
	term.resize(geometry.cols, geometry.rows);
	// To resize after connection is started:
	// stream.setWindow() (see https://github.com/mscdex/ssh2/blob/23bd66f723d2c72c007ed7a3b3afb9f50284bac4/lib/Channel.js#L382)
	if (streamSSH) {
		// Height and width are set to the defaults because their values don't seem to actually matter
		streamSSH.setWindow(geometry.rows, geometry.cols, 480, 640);
	}
}
resize();

ipcRenderer.on("activity", (event, message) => {
	// The blur attribute is applied to the container instead of the cursor itself
	// because the cursor is constantly deleted and readded by xterm.js
	var container = document.getElementById("terminal-container");
	
	if (message === "focus") {
		container.classList.remove("blur");
	}
	if (message === "blur") {
		container.classList.add("blur");
	}
	if (message === "resize") {
		resize();
	}
});

term.write('\x1b[31mExample terminal!\x1b[m\r\n');

conn.connect({});