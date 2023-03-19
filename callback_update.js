import { hrtime } from "node:process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

const requestPassed = isNaN(process.argv[2]) ? null : parseInt(process.argv[2]);

const url = process.argv[process.argv.length - 1].includes("http")
	? process.argv[process.argv.length - 1]
	: "http://localhost:8000/";

console.log(url.includes("https"), url);
const { request } = url.includes("https")
	? require("node:https")
	: require("node:http");
console.log(requestPassed);
const defaults = {
	numberOfRequest: requestPassed || 10,
};
let counter = 0;
let numberOfErrors = 0;
let numberOfSuccess = 0;
let overAllTime = 0;
function makeRequest() {
	const startTime = hrtime();
	const req = request(url, (res) => {
		res.on("data", () => {});
		res.on("end", () => {
			const endTime = hrtime();
			if (res.statusCode >= 400 || res.statusCode >= 500) {
				numberOfErrors++;
			} else {
				numberOfSuccess++;
			}

			let responseTime =
				(endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1e6;
			overAllTime += responseTime;
			counter++;
			if (counter === 10) {
				console.log(
					"\x1b[31m%s\x1b[0m",
					`you have ${numberOfErrors} of requests end with 4xx or 5xx`
				);
				console.log(
					"\x1b[31m%s\x1b[0m",
					`you have ${numberOfSuccess} of requests end with 2xx`
				);
				console.log(
					"\x1b[33m%s\x1b[0m",
					`the average time took for the requests to be completed is ${(
						overAllTime / defaults.numberOfRequest
					).toFixed(2)}ms`
				);
			}
		});
		req.on("error", (err) => {
			console.log("error", err);
		});
	});
	req.end(() => {});
}

for (let i = 0; i < defaults.numberOfRequest; i++) {
	makeRequest();
}
