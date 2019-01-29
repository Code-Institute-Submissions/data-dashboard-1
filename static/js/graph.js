queue()
    .defer(d3.json, "data/bakery.json")
    .defer(d3.json, "data/sales.json")
    .await(makeGraphs);

function makeGraphs(error, bakeryData, salesData) {
    var baking = crossfilter(bakeryData);
    var sales = crossfilter(salesData);

    var parseDate = d3.time.format("%Y/%m/%d").parse;
    bakeryData.forEach(function(d) {
        d.date = parseDate(d.date);
    });
    show_transaction_data(baking);
    show_item_data(baking);
    show_sales_data(sales);
    show_spend_by_name(sales);
    show_stacked_chart(sales);



    dc.renderAll();
}


function show_transaction_data(baking) {

    var transaction_dim = baking.dimension(dc.pluck('food'));
    var total_transaction_of_sales = transaction_dim.group().reduceSum(dc.pluck('sold'));


    dc.barChart('#transaction-data')
        .width(2500)
        .height(300)
        .margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
        })
        .dimension(transaction_dim)
        .group(total_transaction_of_sales)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Transaction")
        .yAxis().ticks(05);

}

function show_item_data(baking) {
    var item_dim = baking.dimension(dc.pluck('food'));
    var total_item_of_sales = item_dim.group().reduceSum(dc.pluck('sold'));
    dc.pieChart('#item-data')
        .height(400)
        .radius(90)
        .transitionDuration(1500)
        .dimension(item_dim)
        .group(total_item_of_sales);
}

function show_sales_data(sales) {

    var date_dim = sales.dimension(dc.pluck('baked'));
    var total_date_of_sales = date_dim.group().reduceSum(dc.pluck('sold'));

    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    console.log(minDate);
    console.log(maxDate);

    dc.lineChart('#purchase-date-sales')
        .width(1000)
        .height(300)
        .margins({
            top: 10,
            right: 50,
            bottom: 30,
            left: 50
        })
        .dimension(date_dim)
        .group(total_date_of_sales)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .y(d3.scale.linear().domain([10000000, 67248485]))
        .xAxisLabel("2 days of products")
        .yAxis().ticks(4);


}

function show_spend_by_name(sales) {

    var date_dim = sales.dimension(dc.pluck('date'));
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;

    function spend_by_name(name) {
        return function(d) {
            if (d.name === name) {
                return +d.spend;
            } else {
                return 0;
            }
        };
    }
    var tomSpendByMonth = date_dim.group().reduceSum(spend_by_name('Sold'));
    var bobSpendByMonth = date_dim.group().reduceSum(spend_by_name('Time'));

    var aliceSpendByMonth = date_dim.group().reduceSum(spend_by_name('Food'));
    var compositeChart = dc.compositeChart('#composite-chart');

    compositeChart
        .width(990)
        .height(200)
        .dimension(date_dim)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .yAxisLabel("Spend")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(compositeChart)
            .colors('green')
            .group(tomSpendByMonth, 'Sold'),
            dc.lineChart(compositeChart)
            .colors('red')
            .group(bobSpendByMonth, 'Time'),
            dc.lineChart(compositeChart)
            .colors('blue')
            .group(aliceSpendByMonth, 'Food')
        ])
        .brushOn(false)
}

function show_stacked_chart(sales) {

    var name_dim = sales.dimension(dc.pluck('name'));
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

}

