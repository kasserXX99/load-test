import { hrtime } from "node:process";

const requestPassed = Number(process.argv[2]);
const url = process.argv[process.argv.length - 1].includes("http")
	? process.argv[process.argv.length - 1]
	: "http://localhost:8000/";

const defaults = {
	numberOfRequests: requestPassed || 10,
};
let counter = 0;
let numberOfErrors = 0;
let numberOfSuccess = 0;
let arrayOfRequests = [];
let totalTime = 0;

for (let i = 0; i < defaults.numberOfRequests; i++) {
	let begining = hrtime.bigint();
	arrayOfRequests.push({ fe: fetch(url), begining });
}

arrayOfRequests.forEach(async (re) => {
	let result = await re.fe;
	let ending = hrtime.bigint();
	const toWholeNumber = Number(ending - re.begining);
	String(result.status).startsWith("4") || String(result.status).startsWith("5")
		? numberOfErrors++
		: numberOfErrors;
	String(result.status).startsWith("2") ? numberOfSuccess++ : numberOfSuccess;
	re.ending = Number(toWholeNumber / 1e6).toFixed(3);
	console.log(re.ending);
	totalTime += Number(re.ending);
	counter++;
	if (counter === defaults.numberOfRequests) {
		console.log(
			"\x1b[31m%s\x1b[0m",
			`you have ${numberOfSuccess} of requests end with 2xx`
		);
		console.log(
			"\x1b[31m%s\x1b[0m",
			`you have ${numberOfErrors} of requests end with 4xx or 5xx`
		);
		console.log(
			"\x1b[33m%s\x1b[0m",
			`the average time took for the request to be completed is ${Number(
				totalTime / defaults.numberOfRequests
			).toFixed(2)}ms`
		);
	}
});
