var term = new Terminal({
	cols: 100,
	rows: 30	,
	useStyle: true,
	screenKeys: true,
	cursorBlink: true
});

term.on("data", (data) => {
	term.write(data);
});
term.on("title", (title) => {
	// Change title
});
term.open(document.getElementsByClassName("content")[0]);

term.write('\x1b[31mWelcome to term.js!\x1b[m\r\n');
