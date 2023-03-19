import { hrtime } from "process";
import { request } from "http";

const url = "http://localhost:8000/";
const numberOfRequests = 10;
let counter = 0;
let overAllTime = 0;

function makeRequest() {
	const startTime = hrtime();
	const req = request(url, (res) => {
		res.on("data", () => {});
		res.on("end", () => {
			const endTime = hrtime();
			let responseTime =
				(endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1e6;
			overAllTime += responseTime;
			counter++;
			if (counter === 10) {
				const averageTime = (overAllTime / numberOfRequests).toFixed(3);
				console.log(
					"the average time the request took is " + averageTime + "ms"
				);
			}
		});
	});
	req.end();
}

for (let i = 0; i < numberOfRequests; i++) {
	makeRequest();
}
