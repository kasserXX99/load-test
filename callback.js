import { request } from "node:http";
import { hrtime } from "node:process";

const requestPassed = process.argv[2];

const url = process.argv[process.argv.length - 1].includes("http")
	? process.argv[process.argv.length - 1]
	: "http://localhost:8000";

//https://jsonplaceholder.typicode.com/todos/1/

const defaults = {
	numberOfRequest: requestPassed || 10,
};
let counter = 0;
let numberOfErrors = 0;
let numberOfSuccess = 0;
let arrOfTime = [];
for (let i = 0; i < defaults.numberOfRequest; i++) {
	let begining = hrtime.bigint();
	let req = request(url, (res) => {
		arrOfTime[i] = { begining };
		res.setEncoding("utf8");
		counter++;
		res.on("data", () => {});
		res.on("end", () => {
			let ending = hrtime.bigint();
			const toWholeNumber = Number(ending - arrOfTime[i].begining);
			if (res.statusCode >= 400 || res.statusCode >= 500) {
				numberOfErrors++;
			} else {
				numberOfSuccess++;
			}
			// we convert the bigint number to a whole number as bigint is not good with fractions we need fraction cause we might get miliseconds
			arrOfTime[i].ending = Number(toWholeNumber / 1e6).toFixed(3) + "ms";
			if (counter === 10) {
				console.log(
					"\x1b[31m%s\x1b[0m",
					`you have ${numberOfErrors} of requests end with 4xx or 5xx`
				);
				console.log(
					"\x1b[31m%s\x1b[0m",
					`you have ${numberOfSuccess} of requests end with 2xx`
				);
				let average = arrOfTime.reduce((a, b) => {
					let removingTheS = b.ending.split("ms");
					return a + Number(removingTheS[0]);
				}, 0);
				console.log(
					"\x1b[33m%s\x1b[0m",
					`the average time took for the request to be completed is ${Number(
						average / defaults.numberOfRequest
					).toFixed(2)}ms`
				);
			}
		});
		req.on("error", (err) => {
			console.log("error", err);
		});
	});
	req.on("error", (err) => {
		console.log("error", err);
	});
	req.end(() => {});
}
