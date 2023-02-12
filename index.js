import { request } from "node:https";
import { hrtime } from "node:process";

const url = "https://jsonplaceholder.typicode.com/todos/";

let arrOfTime = [];
for (let i = 0; i < 10; i++) {
	let begining = hrtime.bigint();
	let req = request(url + i, (res) => {
		// console.log("a push of " + i);
		arrOfTime[i] = { begining };
		res.setEncoding("utf8");

		res.on("data", (data) => {
			// arrOfTime.push({ begining, res, data: JSON.parse(data) });
			// console.log("a request has been made" + i);
			// console.log(data);
		});
		res.on("end", () => {
			let ending = hrtime.bigint();
			const toWholeNumber = Number(ending - arrOfTime[i].begining);
			console.log(res.statusCode);
			// we conver the bigint number to a whole number as bigint is not good with fractions we need fraction cause we might get miliseconds
			// console.log(arrOfTime, arrOfTime.length, i);
			// issue now is here as array size is not equivlant with i
			arrOfTime[i].ending = Number(toWholeNumber / 1e9).toFixed(3) + "s";
			if (arrOfTime.length === 10) {
				console.log(arrOfTime);
				// arrOfTime.forEach((re) => {
				// 	console.log(re.ending);
				// });
			}
		});
		req.on("error", (err) => {
			console.log("error", err);
		});
	});
	req.end(() => {
		console.log("the request has been ended");
	});
	// console.log(arrOfTime);
}
