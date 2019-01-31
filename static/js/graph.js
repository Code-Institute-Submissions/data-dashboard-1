queue()   
   .defer(d3.json, "data/fifa.json")
   .await(makeGraphs);
    
function makeGraphs(error, fifaData) {
        var ndx = crossfilter(fifaData);

        show_nationality(ndx);
        show_age(ndx);
        show_position_of_player(ndx);
        show_wage_vs_value(ndx);
        
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
	
    var position_dim = ndx.dimension(dc.pluck('position'));
    var total_position_of_players = position_dim.group().reduceSum(dc.pluck('club'));
    
    dc.pieChart('#position-of-player')
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(position_dim)
        .group(total_position_of_players)

};

/// LINECHART

function show_wage_vs_value(ndx) {
    var wage_dim = ndx.dimension(dc.pluck('Value'));
    var total_wage_vs_value = wage_dim.group().reduceSum(dc.pluck('Wage'));


    var width = document.getElementById('wage-vs-value').offsetWidth;

    dc.lineChart('#wage-vs-value')
        .width(width)
        .height(300)
        .margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
        })
        .dimension(wage_dim)
        .group(total_wage_vs_value)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .y(d3.scale.linear().domain([10000000, 67248485]))
        .xAxisLabel("Wage vs Value of players")
        .yAxis().ticks(4);


 };
