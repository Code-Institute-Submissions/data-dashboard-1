queue()   
   .defer(d3.json, "data/fifa.json")
   .await(makeGraphs);
    
function makeGraphs(error, fifaData) {
        var ndx = crossfilter(fifaData);
        

        show_nationality(ndx);
        show_age(ndx);
        show_position_of_player(ndx);
        overall_vs_potential(ndx);
        show_stacked_chart(ndx)
        
        dc.renderAll();

}

	


   
// BARCHART 

function show_nationality(ndx) {

    var nationality_dim = ndx.dimension(dc.pluck('Nationality'));
    var total_nationality_of_footballers = nationality_dim.group();
    
    

    var width = document.getElementById("nationality").offsetWidth;


    dc.barChart("#nationality")
        .width(width)
        .height(300)
        .margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
        })
        .dimension(nationality_dim)
        .group(total_nationality_of_footballers)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Players Nationality")
        .yAxis().ticks(10);
};

/// PIECHART 1


function show_age(ndx) {
	
    var age_dim = ndx.dimension(dc.pluck('Name'));
    var total_age_of_players = age_dim.group().reduceSum(dc.pluck('Age'));
    
    dc.pieChart('#age-of-players')
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(age_dim)
        .group(total_age_of_players);
}

/// PIECHART 2

function show_position_of_player(ndx) {
	
    var position_dim = ndx.dimension(dc.pluck('Name'));
    var total_position_of_players = position_dim.group().reduceSum(dc.pluck('Position'));
    
    dc.pieChart('#position-of-player')
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(position_dim)
        .group(total_position_of_players)

};

/// LINECHART





 
///COMPOSITE CHART

function overall_vs_potential(ndx) {

    var overall_dim = ndx.dimension(dc.pluck('Overall'));


    function overall_vs_potential(name) {
        return function(d) {
            if (d.name === name) {
                return +d.spend;
          } else {
               return 0;
           }
       };
    }
    
    var overall = overall_dim.group().reduceSum(overall_vs_potential('Potential'));
    var potential = overall_dim.group().reduceSum(overall_vs_potential('Overall'));

    var compositeChart = dc.compositeChart('#overall-vs-potential');

    compositeChart
        .width(990)
        .height(200)
        .dimension(overall_dim)
        .x(d3.scale.ordinal())
        .yAxisLabel("Overall")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(compositeChart)
            .colors('green')
            .group(overall, 'Potential'),
            dc.lineChart(compositeChart)
            .colors('blue')
            .group(potential, 'overall'),

        ])
        .brushOn(false);
}

function show_stacked_chart(ndx) {

    var name_dim = ndx.dimension(dc.pluck('name'));
    var spendByDay1 = name_dim.group().reduceSum(function(d) {
        if (d.store === '1') {
            return +d.spend;
        } else {
            return 0;
            }
    });
    var spendByDay2 = name_dim.group().reduceSum(function(d) {
        if (d.store === '2') {
            return +d.spend;
        } else {
            return 0;
        }
    });
    var stackedChart = dc.barChart("#stacked-chart");
    stackedChart
        .width(500)
        .height(500)
        .dimension(name_dim)
        .group(spendByDay1, "Day 1")
        .stack(spendByDay2, "Day 2")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(420).y(0).itemHeight(15).gap(5));
    stackedChart.margins().right = 100;

 };
 
 
 /// new chart
 
 /*Race/Ethnicity Bar chart*/
function show_skills(ndx) {
    var skillSet = d3.scale.ordinal()
        .domain(["Crossing: 81"
        ,"Finishing: 84",
    "HeadingAccuracy: 61",
    "ShortPassing: 89",
    "Volleys: 80",
    "Dribbling: 95",
    "Curve: 83",,
    "Marking: 34",])
        .range(["red", "orange", "yellow", "green", "blue","pink","purple","black",]);
    var skillsDim = ndx.dimension(function(d) {
        return [d.race_ethnicity];
    });
    var race_ethnicityMix = race_ethnicityDim.group();

    dc.barChart("#race_ethnicity-graph")
        .width(350)
        .height(250)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .colorAccessor(function(d, i) { return i; })
        .colors(raceColors)
        .dimension(race_ethnicityDim)
        .group(race_ethnicityMix)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Race/Ethnicity")
        .yAxis().ticks(5);
}

 
