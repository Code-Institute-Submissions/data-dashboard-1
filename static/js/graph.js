queue()
	.defer(d3.csv, "data/bakery.csv")
	.await(makegraphs);

function makegraphs(error, bakeryData){
	var ndx = crossfilter(bakeryData);

	var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
	 bakeryData.forEach(function(d) {
		d.date = parseDate(d.date);
		
	 });

function forEach(error, parseDate) {
	var ndx = crossfilter(ndx);
}

	var barChart = dc.barChart("#transaction-data");
    var pieChart = dc.pieChart("#item");
    var lineChart = dc.lineChart("#purchase-date-sales");


 

// var bakeryData = [
// 	"2016 - 10 - 30 09: 58: 11", "1", "Bread",
// 	"2016 - 10 - 30 10: 05: 34", "2", "Scandinavian",
// 	"2016 - 10 - 30 10: 05: 34", "2", "Scandinavian",
// 	"2016 - 10 - 30 10: 07: 57", "3", "Hot chocolate",
// 	"2016 - 10 - 30 10: 07: 57", "3", "Jam",
// 	"2016 - 10 - 30 10: 07: 57", "3", "Cookie",
// 	"2016 - 10 - 30 10: 08: 41", "4", "Muffin",
// 	"2016 - 10 - 30 10: 13: 03", "5", "Coffee",
// 	"2016 - 10 - 30 10: 13: 03", "5", "Pastry",
// 	"2016 - 10 - 30 10: 13: 03", "5", "Bread",
// 	"2016 - 10 - 30 10: 16: 55", "6", "Medialuna",
// 	"2016 - 10 - 30 10: 16: 55", "6", "Pastry",
// 	"2016 - 10 - 30 10: 16: 55", "6", "Muffin",
// 	"2016 - 10 - 30 10: 19: 12", "7", "Medialuna",
// 	"2016 - 10 - 30 10: 19: 12", "7", "Pastry",
// 	"2016 - 10 - 30 10: 19: 12", "7", "Coffee",
// 	"2016 - 10 - 30 10: 19: 12", "7", "Tea",
// 	"2016 - 10 - 30 10: 20: 51", "8", "Pastry",
// 	"2016 - 10 - 30 10: 20: 51", "8", "Bread",
// 	"2016 - 10 - 30 10: 21: 59", "9", "Bread",
// 	"2016 - 10 - 30 10: 21: 59", "9", "Muffin",
// ];


show_transaction_data(ndx);
show_item_data(ndx);
show_purchase_time_sales(ndx);

}

function show_transaction_data(ndx) {
	var transaction_dim = ndx.dimension(dc.pluck('transaction'));
	var total_transaction_of_sales = transaction_dim.group().reduceSum(dc.pluck('transaction'));

	dc.barChart("#transaction-data")
		.width(300)
		.height(150)
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
	var total_item_of_sales = item_dim.group().reduceSum(dc.pluck('item'));

	dc.pieChart("#item-data")
		.height(300)
		.radius(90)
		.transitionDuration(1500)
		.dimension(item_dim)
		.group(total_item_of_sales);
}


function show_purchase_time_sales(ndx) {

	var date_dim = ndx.dimension(dc.pluck('date'));
	var total_date_of_sales = date_dim.group().reduceSum(dc.pluck('date'));

	var minDate = date_dim.bottom(1)[0].date;
	var maxDate = date_dim.top(1)[0].date;

	dc.lineChart("#purchase-date-sales")
		.width(1000)
		.height(300)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(date_dim)
		.group(total_date_of_sales)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.xAxisLabel("Date of items purchased")
		.yAxis().ticks(4);
		
	dc.renderAll();
		

	}
