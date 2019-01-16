queue()
	.defer(d3.json, "data/sales.json")
	.await(makeGraphs);

function makeGraphs(error, bakeryData) {
    	var ndx = crossfilter(bakeryData);
    
    	var parseDate = d3.time.format("%Y-%m-%d").parse;
    	bakeryData.forEach(function(d){
                d.date = parseDate(d.date);
            });
    	var date_dim = ndx.dimension(dc.pluck('baked'));
    	var total_date_of_sales = date_dim.group().reduceSum(dc.pluck('sold'));
    
    	var minDate = date_dim.bottom(1)[0].date;
    	var maxDate = date_dim.top(1)[0].date;
    	console.log(minDate)
    	console.log(maxDate)
    	
    	show_sales_data(ndx);
    	show_line_data(ndx);
    
        dc.renderAll();

}

function show_sales_data(ndx) {

	dc.lineChart('#sales-data')
		.width(1000)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(date_dim)
		.group(total_date_of_sales)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
        .y(d3.scale.linear().domain([10000000,67248485]))		
		.xAxisLabel("Date of items purchased")
		.yAxis().ticks(25);
		
}

function show_line_data(ndx) { 

        dc.lineChart('#line-chart')
            .width(2000)
            .height(300)
            .margins({top: 10, right: 50, bottom: 30, left: 100})
            .dimension(date_dim)
            .group(total_views)
            .transitionDuration(1000)
            .x(d3.time.scale().domain([minDate,maxDate]))
            .y(d3.scale.linear().domain([10000000,67248485]))
            .xAxisLabel("Month")
            .yAxisLabel('Baked')
            
    }