import http from "node:http";

const server = http.createServer((req, res) => {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.write("request was received");
	console.log("request");
	res.end();
});

server.listen(8000, () => {
	console.log("server is listening on port 8000");
});
