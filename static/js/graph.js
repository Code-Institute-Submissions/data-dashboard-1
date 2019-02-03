queue()
    .defer(d3.json, "data/fifa.json")
    .await(makeGraphs);

function makeGraphs(error, fifaData) {
    var ndx = crossfilter(fifaData);

    show_nationality(ndx); // Barchart
    show_age(ndx); // Piechart 1
    show_position_of_player(ndx); //Piehcart 2
    show_wage(ndx); //Linechart
    //show_overall-vs-potential(ndx); ///COMPOSITE CHART
    show_stacked_chart(ndx); ///Stacked CHART        
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

    var position_dim = ndx.dimension(dc.pluck('Position'));

    dc.pieChart('#position-of-player')
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(position_dim)
        .group(position_dim.group());

}

/// LINECHART

function show_wage(ndx) {

    var width = document.getElementById("wage").offsetWidth;
    var wageDim = ndx.dimension(function(d) {
        return d.Name;
    });
    var anotherGroup = wageDim.group().reduceSum(function(d) {
        let total = parseInt(d.Wage.replace(/[^\d]/g, ''), 10);
        return total;
    });
    dc.lineChart('#wage')
        .width(width)
        .height(300)
        .margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .xAxisLabel('Player')
        .yAxisLabel('Wage')
        .dimension(wageDim)
        .group(anotherGroup);

}


function show_stacked_chart(ndx) {
  var name_dim = ndx.dimension(dc.pluck("Club"));
  var releaseGroup = name_dim
    .group()
    .reduceSum(d => parseCurrency(d, "Release Clause"));
  var valueGroup = name_dim.group().reduceSum(d => parseCurrency(d, "Value"));
  var wageGroup = name_dim.group().reduceSum(d => parseCurrency(d, "Wage"));
  var stackedChart = dc.barChart("#stacked-chart");
  stackedChart
    .width(990)
    .height(500)
    .dimension(name_dim)
    .group(releaseGroup, "Release Clause")
    .stack(valueGroup, "Value")
    .stack(wageGroup, "Wage")
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .legend(
      dc
        .legend()
        .x(50)
        .y(0)
        .itemHeight(15)
        .gap(5)
    );
  stackedChart.margins().right = 100;
}

// Utils
function parseCurrency(d, variable = "Wage") {
  const value = d[variable].replace(/€/, "");
  let multiplier = 0;
  if (value.includes("M")) {
    multiplier = 1000000;
  }
  if (value.includes("K")) {
    multiplier = 1000;
  }
  if (variable == "Wage") {
    multiplier = multiplier * 52;
  }
  const number = parseFloat(value.replace(/(M|K)/g, ""));
  console.log(d.Name, variable, number * multiplier);
  return number * multiplier;
}
