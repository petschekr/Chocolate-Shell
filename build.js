"use strict";
const fs = require("fs");
const path = require("path");
const less = require("less");

const baseDir = path.join(__dirname, "app/css");
let cssFiles = fs.readdirSync(baseDir);

var compilingPromises = [];
for (let cssFile of cssFiles) {
	if (!path.isAbsolute(cssFile)) {
		cssFile = path.join(baseDir, cssFile);
	}
	if (fs.statSync(cssFile).isDirectory()) {
		let subFiles = fs.readdirSync(cssFile);
		let deltaPath = path.relative(baseDir, cssFile);
		for (let subFile of subFiles) {
			cssFiles.push(path.join(baseDir, deltaPath, subFile));
		}
		continue;
	}
	if (path.extname(cssFile).toLowerCase() !== ".less")
		continue;
	
	console.log(`Compiling: ${cssFile}`);
	compilingPromises.push(new Promise(function (resolve, reject) {
		fs.readFile(cssFile, "utf8", function (err, data) {
			if (err) return reject(err);
			
			less.render(data, {
				"paths": [baseDir],
				"filename": path.basename(cssFile),
				"strictMath": true
			}, function (err, output) {
				if (err) return reject(err);
				
				let writingPath = path.resolve(path.dirname(cssFile), path.basename(cssFile, ".less") + ".css")
				fs.writeFile(writingPath, output.css, "utf8", function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
		});
	}));
}
Promise.all(compilingPromises).then(function () {
	console.log("Done compiling");
	process.exit(0);
}).catch(function (err) {
	console.error("Error compiling:");
	console.error("\t" + err.message);
	console.error(err);
});