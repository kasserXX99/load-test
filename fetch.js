import { hrtime } from "process";

let url = "http://localhost:8000/";
let numberOfRequests = 10;
let counter = 0;
let arrOfRequests = [];
let overAllTime = 0;

for (let i = 0; i < numberOfRequests; i++) {
	let startTime = hrtime();
	arrOfRequests.push({ req: fetch(url), startTime });
}

// for (let i = 0; i < numberOfRequests; i++) {
// 	let startTime = hrtime();
// 	fetch(url).then((res) => {
// 		let endTime = hrtime();
// 		let responseTime =
// 			(endTime[0] - startTime[0]) * 1000 + (endTime[1] - startTime[1]) / 1e6;
// 		console.log(responseTime);
// 		overAllTime += responseTime;
// 		counter++;
// 		if (counter === 10) {
// 			const averageTime = (overAllTime / numberOfRequests).toFixed(3);
// 			console.log("the average time the request took is " + averageTime + "ms");
// 		}
// 	});
// }

// arrOfRequests.forEach(async (request) => {
// 	let res = await request.req;
// 	counter++;
// 	let endTime = hrtime();
// 	let responseTime =
// 		(endTime[0] - request.startTime[0]) * 1000 +
// 		(endTime[1] - request.startTime[1]) / 1e6;
// 	overAllTime += responseTime;
// 	if (counter === 10) {
// 		const averageTime = (overAllTime / numberOfRequests).toFixed(3);
// 		console.log("the average time the request took is " + averageTime + "ms");
// 	}
// });

await Promise.all(
	arrOfRequests.map(async (request) => {
		let res = await request.req;
		let endTime = hrtime();
		let responseTime =
			(endTime[0] - request.startTime[0]) * 1000 +
			(endTime[1] - request.startTime[1]) / 1e6;
		// console.log(responseTime);
		overAllTime += responseTime;
		return res;
	})
);

// console.log(overAllTime);
const averageTime = (overAllTime / numberOfRequests).toFixed(3);
console.log("the average time the request took is " + averageTime + "ms");
