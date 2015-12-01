var moment = require('moment');
var TimeUtility = {
	dayStringForDate: function(date) {
		var dayDiff, now, parsedDate, result;
		now = moment();
		parsedDate = moment(date);
		dayDiff = Math.abs(parsedDate.diff(now, "days"));
		if (dayDiff >= 6 || dayDiff <= -6) {
			if (parsedDate.year() !== now.year()) {
				result = parsedDate.format("MMM Do 'YY");
			} else {
				result = parsedDate.format("MMM Do");
			}
			return result;
		} else {
			return this.getDayWithoutTime(parsedDate);
		}
	},
	getDayWithoutTime: function(day) {
		var fullStr, timeIndex;
		fullStr = day.calendar();
		timeIndex = fullStr.indexOf(" at ");
		if (timeIndex !== -1) {
			return fullStr.slice(0, timeIndex);
		} else {
			return fullStr;
		}
	},
	isAmPm: function(){
		return true;
	},
	getTimeStr:function(date){
		var format;
		format = this.isAmPm() ? "h:mma" : "H:mm";
		return moment(date).format(format);
	}
}

module.exports = TimeUtility;