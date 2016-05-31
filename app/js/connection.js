const EventEmitter = require("events");
const ssh2 = require("ssh2");
const Client = ssh2.Client;

class Connection extends EventEmitter {
	constructor (connectOptions, dimensions) {
		this.connectOptions = connectOptions;
		this.dimensions = dimensions;
		this.errorCallback = errorCallback;
		if (!this.errorCallback) {
			this.errorCallback = function () {};
		}
		
		this.stream = null;
		this.connection = new Client();
	}
	ready () {
		this.emit("info", "Client is ready");
		connection.shell({
			cols: this.dimensions.cols,
			rows: this.dimensions.rows
		}, this.onConnect);
	}
	connect (connectOptions = null) {
		if (connectOptions)
			this.connectOptions = connectOptions;
		this.connection.connect(this.connectOptions);
	}
	resize (cols, rows) {
		if (this.stream) {
			// Height and width are set to the defaults because their values don't seem to actually matter
			this.stream.setWindow(rows, cols, 480, 640);
		}
		else {
			this.emit("info", "Connection not established! (resize)");
			console.warn("Connection not established! (resize)");
		}
	}
	write (data) {
		if (this.stream !== null) {
			this.stream.write(data);
		}
		else {
			this.emit("info", "Connection not established! (write)");
			console.warn("Connection not established! (write)");
		}
	}
	// Events
	onConnect (err, stream) {
		if (err)
			return errorCallback();
		this.emit("info", "Connection successful");
		this.stream = stream;
		stream
			.on("close", this.onClose.bind(this))
			.on("data", this.onData.bind(this))
			.stderr.on("data", onErrorData.bind(this));
	}
	onData (data) {
		this.emit("data", data);
		this.emit("stdout", data);
	}
	onErrorData (data) {
		this.emit("data", data);
		this.emit("stderr", data);
	}
	onClose () {
		this.emit("info", "Connection stream closed");
		this.connection.end();
		this.stream = null;
	}
}

module.exports = Connection;