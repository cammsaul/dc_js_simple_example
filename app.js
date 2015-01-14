'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter */

// get ref to the div where chart will go
var pieChart = dc.pieChart('#chart');

// ******************** LOAD OUR DATA ******************** //
// this can be done like:
// d3.csv('data.csv', function(data) { ... });
// d3.json('data.json', function(data) { ... });
// jQuery.getJson('data.json', function(data) { ... });

// Our data is a CSV of Expt,Run,Speed
d3.csv('morley.csv', function(error, experiments_data) { // experiments_data is an array of dicts loaded from the CSV

    console.log("experiments_data ---------->", experiments_data);

    // ******************** CREATE CROSSFILTER DIMENSIONS AND GROUPS ******************** //
    // a 'crossfilter' represents a multidimensional dataset
    // crossfilter([records])
    // RECORDS is any array of JavaScript objects or primitives
    var ndx = crossfilter(experiments_data),

        // DIMENSION
        // crossfilter.dimension(value)
        // Construct a new Dimension using the specified VALUE accessor function
        // VALUE must return naturally-ordered values, i.e. values that behave correctly with respect to <, <=, >=, and >
        // typically booleans, numbers, or strings, but you can override object.valueOf for objects such as Dates
        runDimension = ndx.dimension(function(d) {
            return "run-" + d.Run;
        }),

        // GROUP (MAP-REDUCE)
        // dimension.group(groupValue = identityFunction)
        // Constructs a new grouping for the given dimension according to the specified GROUPVALUE function
        // groupValue(dimensionValue) -> correspondingRoundedValue
        //
        // group.reduceSum(value)
        // sum records using VALUE accessor function
        //
        // e.g. group payments by type and sum by total
        // var paymentsByType = payments.dimension(function(d) { return d.type; }),
        //     paymentVolumeByType = paymentsByType.group().reduceSum(function(d) { return d.total; });
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
        .legend(dc.legend()) // this works in DC version 2.0 and above (!)
        .turnOnControls(true);

    pieChart.render();
});