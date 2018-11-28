queue()
	.defer(d3.json, "data/bakery.json")
	.await(makegraphs);

function makegraphs(error, bakeryData){
	var ndx = crossfilter(bakeryData);

	show_transaction_data(ndx);
	show_item_data(ndx);

    dc.renderAll();

}

function show_transaction_data(ndx) {

	var transaction_dim = ndx.dimension(dc.pluck('item'));
	var total_transaction_of_sales = transaction_dim.group().reduceSum(dc.pluck('transaction'));


	dc.barChart("#transaction-data")
		.width(2500)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(transaction_dim)
		.group(total_transaction_of_sales)
		.transitionDuration(500)
		.x(d3.scale.ordinal())
		.xUnits(dc.units.ordinal)
		.xAxisLabel("Transaction")
		.yAxis().ticks(20);

}

function show_item_data(ndx) {
	var item_dim = ndx.dimension(dc.pluck('item'));
	var total_item_of_sales = item_dim.group().reduceSum(dc.pluck('transaction'));
	dc.pieChart("#item-data")
		.height(1000)
		.radius(450)
		.transitionDuration(1500)
		.dimension(item_dim)
		.group(total_item_of_sales);
}