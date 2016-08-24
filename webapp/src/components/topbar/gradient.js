var oldTime = null;
var fullDaySeconds = 86400;
var gradientSegmentPercentage = 100 / 11;

var Gradient = {
	daySegments: [
		{
			time: 37.5, // 00:00 - 09:00
			width: gradientSegmentPercentage / 2
		},
		{
			time: 4.166666, // 09:00 - 10:00
			width: gradientSegmentPercentage * 2 + (gradientSegmentPercentage / 2)
		},
		{
			time: 33.333333, // 10:00 - 18:00
			width: gradientSegmentPercentage * 2 - (gradientSegmentPercentage / 2)
		},
		{
			time: 6.25, // 18:00 - 19:30
			width: gradientSegmentPercentage * 4 + (gradientSegmentPercentage / 2)
		},
		{
			time: 18.75, // 19:30 - 00:00
			width: gradientSegmentPercentage * 2
		}
	],
	getGradientPos: function() {
		var percentOfDay = this.percentOfCurrentDay();
		var daySegments = this.daySegments;
		var segLen = daySegments.length;
		var segTimeSum = 0;
		var currentWidth = 0;

		for (var i=0; i<segLen; i++) {
			var seg = daySegments[i];

			segTimeSum = segTimeSum + seg.time;

			if (percentOfDay >= segTimeSum) {
				currentWidth = currentWidth + seg.width;
			} else {
				var prevSegSum = segTimeSum - seg.time;
				var portionOfDay = percentOfDay - prevSegSum;
				var percentOfSeg = portionOfDay / seg.time * 100;
				var width = seg.width * percentOfSeg / 100;

				currentWidth = currentWidth + width;
				break;
			}
		}

		//var currentTimePercentage = percentOfDay / prevSegSum * 100;
		var currentGradientPosition = (100 * currentWidth) / 100;
		currentGradientPosition = Math.round( currentGradientPosition * 1e2 ) / 1e2;
		return currentGradientPosition;
	},

	percentOfCurrentDay: function() {
		var today = new Date();
		var hoursSeconds = today.getHours() * 60 * 60;
		var minutesSeconds = today.getMinutes() * 60;
		var seconds = today.getSeconds();
		var currentTimeSeconds = hoursSeconds + minutesSeconds + seconds;
		var percentOfCurrentDay = currentTimeSeconds / fullDaySeconds * 100;

		return percentOfCurrentDay;
	}
};
module.exports = Gradient;
