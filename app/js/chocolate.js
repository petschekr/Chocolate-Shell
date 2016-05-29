var Client = require("ssh2").Client;
var conn = new Client();

let streamSSH;

conn.on("ready", function () {
	console.log("Client is ready");
	conn.shell(function (err, stream) {
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
	cols: 100,
	rows: 30	,
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
term.open(document.getElementsByClassName("content")[0]);

term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');

conn.connect({});