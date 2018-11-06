queue()
    .defer(d3.csv, "data/googleplaystore.csv")
    .await(makeGraph);
    
function makeGraph(error, storeData) {
     
}    