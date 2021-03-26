const { DateTime } = require("luxon");
const unixTimestamp = 1616792546 * 1000; //convert to milliseconds
console.log(DateTime.fromMillis(unixTimestamp).toFormat("dd'-'MM'-'y'_'HH'-'mm'-'ss'")) //Telegram style: 18-03-2021_22-37-33
