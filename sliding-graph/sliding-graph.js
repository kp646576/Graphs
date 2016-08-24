/*------------------------------------------------------------------------------
    Intialization
------------------------------------------------------------------------------*/
// Graph declarations
var t = 40;
var n = 40;
var width = CONFIG.CANVAS.width - CONFIG.MARGIN.left - CONFIG.MARGIN.right - CONFIG.MARGIN.yAxis - CONFIG.MARGIN.yLabel;
var height = CONFIG.CANVAS.height - CONFIG.MARGIN.top - CONFIG.MARGIN.bottom - CONFIG.MARGIN.xLabel;

var x = d3.scale.linear()
    .domain([t - n + 1, t])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([CONFIG.yMin, CONFIG.yMax])
    .range([height, 0]);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) {
        return x(d.x);
    })
    .y(function(d, i) {
        return y(d.y);
    });

// Canvas
var canvas = d3.select("body").append("svg")
    .attr("width", width + CONFIG.MARGIN.left + CONFIG.MARGIN.right + CONFIG.MARGIN.yAxis + CONFIG.MARGIN.yLabel + CONFIG.MARGIN.legend)
    .attr("height", height + CONFIG.MARGIN.top + CONFIG.MARGIN.bottom + CONFIG.MARGIN.xLabel);

// Graph
var g = canvas.append("g")
    .attr("transform", "translate(" + CONFIG.MARGIN.left + "," + CONFIG.MARGIN.top + ")");

// Extra svg to clip the graph and x axis as they transition in and out
var graph = g.append("svg")
    .attr("x", 50)
    .attr("y", 50)
    .attr("width", width + CONFIG.MARGIN.yAxis + CONFIG.MARGIN.yLabel)
    .attr("height", height + CONFIG.MARGIN.top + CONFIG.MARGIN.bottom);

/*------------------------------------------------------------------------------
    Axes & Labels
------------------------------------------------------------------------------*/
// Title
g.append("text")
    .attr("class", "axis-label")
    .attr("x", (width + CONFIG.MARGIN.right + CONFIG.MARGIN.yAxis + CONFIG.MARGIN.yLabel) / 2 + 50)
    .attr("y", CONFIG.MARGIN.top / 2 + 20)
    .attr("text-anchor", "middle")
    .text(CONFIG.title);

// Legend
var legend = canvas.selectAll(".legend")
    .data(["Inattentive Gaze", "Monitor Gaze", "Keyboard Gaze", "Face Gaze"])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });

var color = d3.scale.ordinal()
    .range(["#27ae60", "#2980b9", "#f1c40f", "#c0392b"]);

legend.append("rect")
    .attr("x", width + 210)
    .attr("y", 50)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legend.append("text")
    .attr("x", width + 200)
    .attr("y", 60)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
        return d;
    });

// X-Axis
var xAxis = d3.svg.axis().outerTickSize(0).scale(x).orient("bottom");
var axis = graph.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis = xAxis);

// X-Axis Label
canvas.append("text")
    .attr("class", "axis-label")
    .attr("x", (width + CONFIG.MARGIN.yAxis + CONFIG.MARGIN.yLabel) / 2 + CONFIG.MARGIN.left)
    .attr("y", height + CONFIG.MARGIN.bottom + CONFIG.MARGIN.xLabel - 10)
    .style("text-anchor", "middle")
    .text(CONFIG.xAxisLabel);

// Y-Axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

g.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (50) + ",50)")
    .call(yAxis);


// Y-Axis Label (need to draw after white box to show up)
canvas.append("text")
    .attr("transform", "translate(50, " + (height / 2 - CONFIG.MARGIN.bottom + 50) + ") rotate(-90)")
    .attr("class", "axis-label")
    .style("text-anchor", "middle")
    .text(CONFIG.yAxisLabel);

/*------------------------------------------------------------------------------
    Data Manipulation
------------------------------------------------------------------------------*/
d3.csv(CONFIG.dataFile, function(data) {
    var duration = CONFIG.duration;
    var organizedData = new Array();
    var numLines;

    // Column names and number of lines to generate (columns - 1)
    var names = Object.keys(data[0]);
    numLines = names.length - 1;

    // Format data into array of (x, y) coordinate objects 
    for (i = 0; i < numLines; i++) {
        organizedData[i] = new Array();
        data.map(function(d) {
            organizedData[i].push({
                x: parseFloat(d[names[0]]),
                y: parseFloat(d[names[i + 1]])
            });
        });
    };

    // Intial line refrences
    // TODO: Fix duplicate color declaration
    var colors = ["#27ae60", "#2980b9", "#f1c40f", "#c0392b"];
    var lines = [];
    for (var i = 0; i < numLines; i++) {
        lines.push(
            graph.append("g")
            .append("path")
            .data([organizedData[i]])
            .attr("fill", "none")
            .attr("stroke", colors[i])
            .attr("stroke-width", CONFIG.strokeWidth)
        );
    }

    // Self updating tick function
    (function update() {
        if (t < 903) {
            t++;

            // update the domains
            x.domain([t - n + 2, t]);

            // redraw the lines
            for (var i = 0; i < numLines; i++) {
                lines[i].attr("d", line).attr("transform", null);
            }

            // slide the line left
            for (var i = 0; i < numLines; i++) {
                lines[i].transition()
                    .duration(duration)
                    .ease("linear")
                    .attr("transform", "translate(" + x(t - n + 1) + ")");;
            }

            // slide the x-axis left
            axis.transition()
                .duration(duration)
                .ease("linear")
                .call(xAxis)
                .each("end", update);

            // Shift data to the left
            for (var i = 0; i < numLines; i++) {
                organizedData[i].shift();
            }
        }
    })();

});
