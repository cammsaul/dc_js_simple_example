'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */

// get ref to the div where chart will go
var pieChart = dc.pieChart('#chart');

// load the data
// CSV of Expt,Run,Speed
d3.csv('morley.csv', function(error, experiments_data) { // experiments_data is an array of dicts loaded from the CSV

    console.log("experiments_data ---------->", experiments_data);

    var ndx = crossfilter(experiments_data),
        runDimension = ndx.dimension(function(d) {
            return "run-" + d.Run;
        }),
        speedSumGroup = runDimension.group().reduceSum(function(d) {
            return d.Speed * d.Run;
        });

    console.log("ndx ---------->", ndx);
    console.log("runDimension ---------->", runDimension);
    console.log("speedSumGroup ---------->", speedSumGroup);

    pieChart
        .width(768)
        .height(480)
        .slicesCap(4) // limit pie chart to this many slices; lump smallest slices into 'other'
        .innerRadius(50) // size of "donut hole" to remove from displayed chart
        .dimension(runDimension)
        .group(speedSumGroup)
        .legend(dc.legend()); // this works in DC version 2.0 and above (!)

    pieChart.render();
});