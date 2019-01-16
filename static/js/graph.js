queue()   
   .defer(d3.json, "data/bakery.json")
   .await(makeGraphs);
    
function makeGraphs(error, bakeryData) {
        var ndx = crossfilter(bakeryData);
       
        show_transaction_data(ndx);
        show_item_data(ndx);
       
        
        dc.renderAll();

}


function show_transaction_data(ndx) {
	
	var transaction_dim = ndx.dimension(dc.pluck('food'));
	var total_transaction_of_sales = transaction_dim.group().reduceSum(dc.pluck('sold'));


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
		.yAxis().ticks(05);

}
function show_item_data(ndx) {
	var item_dim = ndx.dimension(dc.pluck('food'));
	var total_item_of_sales = item_dim.group().reduceSum(dc.pluck('sold'));
	dc.pieChart("#item-data")
		.height(400)
		.radius(90)
		.transitionDuration(1500)
		.dimension(item_dim)
		.group(total_item_of_sales);
}