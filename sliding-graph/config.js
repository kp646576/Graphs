/*
	Notes:
	subsetIndex must be greater than upperbound on domain to ensure smooth updates
*/
var CONFIG = 
{
	dataFile: "data.csv",
	// Index to determine up to where the initial data will show
	dataPoints: 100,
	subsetIndex: 110,
	title: "Percentage over Time",//"Percentage of Gaze Behaviors Throughout 30 Seconds of Typing",
	xAxisLabel: "Time (seconds)",
	yAxisLabel: "Percentage",
	strokeWidth: 5,
	duration: 200,
	MARGIN: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 40,
        xLabel: 100,
        yAxis: 50,
        yLabel: 50,
        legend: 300
    },
    CANVAS: {
    	height: 500,
    	width: 1000
    },
    yMin: 0,
    yMax: 100,
}
