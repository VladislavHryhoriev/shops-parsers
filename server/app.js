const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {

	let variableValues = {
		title: 'Заголовок',
		content: 'Текст статьи'
	};

	// if (req.url === '/user') {
	// 	fs.readFile("./server/index.html", 'utf-8', (error, data) => {
	// 		let text = ""

	// 		let newData = data.replace(/{(.+)}/gi, (match, variableName) => {
	// 			console.log(`${match}, ${variableName}`);
	// 		});

	// 		res.setHeader('Content-Type', 'text/html; charset=utf-8')
	// 		res.end(1);
	// 	});
	// }

}).listen(5050);
