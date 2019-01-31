queue()   
   .defer(d3.json, "data/fifa.json")
   .await(makeGraphs);
    
function makeGraphs(error, fifaDatayData) {
        var ndx = crossfilter(fifaData);
        
        var parseDate = d3.time.format("%Y/%m/%d").parse;
    fifaData.forEach(function(d) {
        d.date = parseDate(d.date);
    });
       
        show_nationality(ndx);
        show_age(ndx);
        show_position_of_player(ndx);

        
        dc.renderAll();

}

   // show_wage_vs_value(ndx)
   // show_spend_by_name(sales);
   // show_stacked_chart(sales);
   
	


   
// BARCHART 

function show_nationality(ndx) {

    var nationality_dim = ndx.dimension(dc.pluck('Nationality'));
    var total_nationality_of_footballers = nationality_dim.group().reduceSum(dc.pluck('Name'));

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
        .yAxis().ticks(05);
}

/// PIECHART 1


function show_age(ndx) {
	
    var age_dim = ndx.dimension(dc.pluck('Age'));
    var total_age_of_players = age_dim.group().reduceSum(dc.pluck('Name'));
    
    dc.pieChart("#age-of-players")
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(age_dim)
        .group(total_age_of_players);
}

/// PIECHART 2

function show_position_of_player(ndx) {
	
    var position_dim = ndx.dimension(dc.pluck('Position'));
    var total_position_of_players = position_dim.group().reduceSum(dc.pluck('Club'));
    
    dc.pieChart('#position-of-player')
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(position_dim)
        .group(total_position_of_players)

};