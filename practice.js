/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/
//--------bubble chart -----------
// var margin = { left:80, right:20, top:50, bottom:100 };
// var height = 500 - margin.top - margin.bottom, 
//     width = 800 - margin.left - margin.right;

// var g = d3.select("#practiceChart-area")
//     .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", "translate(" + margin.left + 
//             ", " + margin.top + ")");

// var time = 0;



// // Scales
// var x = d3.scaleLog()
//     .base(10)
//     .range([0, width])
//     .domain([142, 150000]);
// var y = d3.scaleLinear()
//     .range([height, 0])
//     .domain([0, 90]);
// var area = d3.scaleLinear()
//     .range([25*Math.PI, 1500*Math.PI])
//     .domain([2000, 1400000000]);
// var continentColor = d3.scaleOrdinal(d3.schemePastel1);

// // Labels
// var xLabel = g.append("text")
//     .attr("y", height + 50)
//     .attr("x", width / 2)
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")
//     .text("GDP Per Capita ($)");
// var yLabel = g.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", -40)
//     .attr("x", -170)
//     .attr("font-size", "20px")
//     .attr("text-anchor", "middle")
//     .text("Life Expectancy (Years)")
// var timeLabel = g.append("text")
//     .attr("y", height -10)
//     .attr("x", width - 40)
//     .attr("font-size", "40px")
//     .attr("opacity", "0.4")
//     .attr("text-anchor", "middle")
//     .text("1800");

// // X Axis
// var xAxisCall = d3.axisBottom(x)
//     .tickValues([400, 4000, 40000])
//     .tickFormat(d3.format("$"));
// g.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height +")")
//     .call(xAxisCall);

// // Y Axis
// var yAxisCall = d3.axisLeft(y)
//     .tickFormat(function(d){ return +d; });
// g.append("g")
//     .attr("class", "y axis")
//     .call(yAxisCall);


// var continents = ["europe", "asia", "americas", "africa"];
// var legend = g.append("g")
//     .attr("transform", "translate("+ (width - 10) + "," + (height - 125) +")" );

//     continents.forEach(function(continent, i){
//     var legendRow = legend.append("g")
//     .attr("transform", "translate(0, "+(i *20) +")" );

//     legendRow.append("rect")
//         .attr("width", 10)
//         .attr("height", 10)
//         .attr("fill", continentColor(continent));
//     legendRow.append("text")
//         .attr("x", -10)
//         .attr("y", 10)
//         .attr("text-anchor", "end")
//         .style("text-transform", "capotalize")
//         .text(continent);

// });

// d3.json("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/05/5.10.1/data/data.json").then(function(data){
//     console.log(data);

//     // Clean data
//     const formattedData = data.map(function(year){
//         return year["countries"].filter(function(country){
//             var dataExists = (country.income && country.life_exp);
//             return dataExists
//         }).map(function(country){
//             country.income = +country.income;
//             country.life_exp = +country.life_exp;
//             return country;            
//         })
//     });

//     // Run the code every 0.1 second
//     d3.interval(function(){
//         // At the end of our data, loop back
//         time = (time < 214) ? time+1 : 0
//         update(formattedData[time]);            
//     }, 100);

//     // First run of the visualization
//     update(formattedData[0]);

// })

// function update(data) {
//     // Standard transition time for the visualization
//     var t = d3.transition()
//         .duration(100);

//     // JOIN new data with old elements.
//     var circles = g.selectAll("circle").data(data, function(d){
//         return d.country;
//     });

//     // EXIT old elements not present in new data.
//     circles.exit()
//         .attr("class", "exit")
//         .remove();

//     // ENTER new elements present in new data.
//     circles.enter()
//         .append("circle")
//         .attr("class", "enter")
//         .attr("fill", function(d) { return continentColor(d.continent); })   
//         .merge(circles)
//         .transition(t)
//             .attr("cy", function(d){ return y(d.life_exp); })
//             .attr("cx", function(d){ return x(d.income) })
//             .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI) });

//     // Update the time label
//     timeLabel.text(+(time + 1800))
// }

////-------------Line Chart ------------------

/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 3 - CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + 
            ", " + margin.top + ")");

var t = function(){ return d3.transition().duration(1000); }

var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Add the line for the first time
g.append("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", "3px");

// Labels
var xLabel = g.append("text")
    .attr("class", "x axisLabel")
    .attr("y", height + 50)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Time");
var yLabel = g.append("text")
    .attr("class", "y axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -170)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Price (USD)")

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// X-axis
var xAxisCall = d3.axisBottom()
    .ticks(4);
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height +")");

// Y-axis
var yAxisCall = d3.axisLeft()
var yAxis = g.append("g")
    .attr("class", "y axis");

// Event listeners
$("#coin-select").on("change", update)
$("#var-select").on("change", update)

// Add jQuery UI slider
$("#date-slider").slider({
    range: true,
    max: parseTime("31/10/2017").getTime(),
    min: parseTime("12/5/2013").getTime(),
    step: 86400000, // One day
    values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
    slide: function(event, ui){
        $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
        update();
    }
});

d3.json("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/06/6.10.1/data/coins.json").then(function(data){
    // console.log(data);

    // Prepare and clean data
    filteredData = {};
    for (var coin in data) {
        if (!data.hasOwnProperty(coin)) {
            continue;
        }
        filteredData[coin] = data[coin].filter(function(d){
            return !(d["price_usd"] == null)
        })
        filteredData[coin].forEach(function(d){
            d["price_usd"] = +d["price_usd"];
            d["24h_vol"] = +d["24h_vol"];
            d["market_cap"] = +d["market_cap"];
            d["date"] = parseTime(d["date"])
        });
    }

    // Run the visualization for the first time
    update();
})

function update() {
    // Filter data based on selections
    var coin = $("#coin-select").val(),
        yValue = $("#var-select").val(),
        sliderValues = $("#date-slider").slider("values");
    var dataTimeFiltered = filteredData[coin].filter(function(d){
        return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
    });

    // Update scales
    x.domain(d3.extent(dataTimeFiltered, function(d){ return d.date; }));
    y.domain([d3.min(dataTimeFiltered, function(d){ return d[yValue]; }) / 1.005, 
        d3.max(dataTimeFiltered, function(d){ return d[yValue]; }) * 1.005]);

    // Fix for format values
    var formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
      var s = formatSi(x);
      switch (s[s.length - 1]) {
        case "G": return s.slice(0, -1) + "B";
        case "k": return s.slice(0, -1) + "K";
      }
      return s;
    }

    // Update axes
    xAxisCall.scale(x);
    xAxis.transition(t()).call(xAxisCall);
    yAxisCall.scale(y);
    yAxis.transition(t()).call(yAxisCall.tickFormat(formatAbbreviation));

    // Clear old tooltips
    d3.select(".focus").remove();
    d3.select(".overlay").remove();

    // Tooltip code
    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");
    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);
    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);
    focus.append("circle")
        .attr("r", 5);
    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");
    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);
        
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(dataTimeFiltered, x0, 1),
            d0 = dataTimeFiltered[i - 1],
            d1 = dataTimeFiltered[i],
            d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d[yValue]) + ")");
        focus.select("text").text(function() { return d3.format("$,")(d[yValue].toFixed(2)); });
        focus.select(".x-hover-line").attr("y2", height - y(d[yValue]));
        focus.select(".y-hover-line").attr("x2", -x(d.date));
    }

    // Path generator
    line = d3.line()
        .x(function(d){ return x(d.date); })
        .y(function(d){ return y(d[yValue]); });

    // Update our line path
    g.select(".line")
        .transition(t)
        .attr("d", line(dataTimeFiltered));

    // Update y-axis label
    var newText = (yValue == "price_usd") ? "Price (USD)" :
        ((yValue == "market_cap") ?  "Market Capitalization (USD)" : "24 Hour Trading Volume (USD)")
    yLabel.text(newText);
}


