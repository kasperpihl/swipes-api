var oldTime = null;
var fullDaySeconds = 86400;
var gradientSegmentPercentage = 100 / 12;

const gradientColors = [
	'#1D2069',
	'#486FBC',
	'#FFA68F',
	'#F67F7F',
	'#74C7F5',
	'#4973C9',
	'#D07CA7',
	'#F4945F',
	'#F5919E',
	'#B46F89',
	'#1D2069',
	'#486FBC'
]

var Gradient = {
	daySegments: [
		{
			time: 37.5, // 00:00 - 09:00
			width: gradientSegmentPercentage / 2
		},
		{
			time: 4.166666, // 09:00 - 10:00
			width: gradientSegmentPercentage * 3 + (gradientSegmentPercentage / 2)
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
	getGradientPos: function(percent) {
		if(!percent) 
			percent = this.percentOfCurrentDay();
		var daySegments = this.daySegments;
		var segLen = daySegments.length;
		var segTimeSum = 0;
		var currentWidth = 0;

		for (var i=0; i<segLen; i++) {
			var seg = daySegments[i];

			segTimeSum = segTimeSum + seg.time;

			if (percent >= segTimeSum) {
				currentWidth = currentWidth + seg.width;
			} else {
				var prevSegSum = segTimeSum - seg.time;
				var portionOfDay = percent - prevSegSum;
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
	getGradientStyles(){
		return {
			background: 'linear-gradient(to right, ' + gradientColors.join(', ') + ')',
			backgroundSize: '1100% 1100%'
		}
	},
	percentOfValue(elapsed, total){
		if(elapsed > total){
			elapsed = elapsed % total;
		}
		return (elapsed / total) * 100;
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
export default Gradient;
