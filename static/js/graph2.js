queue()
	.defer(d3.json, "data/sales.json")
	.await(makegraphs);

function makegraphs(error, bakeryData){
	var ndx = crossfilter(bakeryData);
	
	show_sales_data(ndx);

    dc.renderAll();

}

function show_sales_data(ndx) {

	var date_dim = ndx.dimension(dc.pluck('date'));
	var total_date_of_sales = date_dim.group().reduceSum(dc.pluck('sold'));

	var minDate = date_dim.bottom(1)[0].date;
	var maxDate = date_dim.top(1)[0].date;
	console.log(minDate)
	console.log(maxDate)

	dc.lineChart("#purchase-date-sales")
		.width(1000)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(date_dim)
		.group(total_date_of_sales)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
        .y(d3.scale.linear().domain([10000000,67248485]))		
		.xAxisLabel("Date of items purchased")
		.yAxis().ticks(4);
		

}