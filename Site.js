$(document).ready(function () {
    VACases();
    $("#dataSet").selectmenu();

    $('#dataSet').on('selectmenuchange', function () {
        var valueofbox = $("#dataSet option:selected").val();

        if (valueofbox == "VA") {
            $("#realChart-area").empty();
            VACases();

        }
        else if (valueofbox == "U.S") {
            $("#realChart-area").empty();
            USCases();

        } else {

        }

    });

});

var formatC = d3.format(",");
var formatP = d3.format(".0%");
var parseTime = d3.timeParse("%m/%d/%Y");
var toreadDate = d3.timeFormat("%m/%d/%Y");


function VACases() {

    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.Date = parseTime(d.Date);
        });

        dataToSlider(data);
        totalVACases(data);

    }).catch(function (error) {
        console.log(error);
    });


    function dataToSlider(data) {
        var minDate = d3.min(data, function (d) { return d.Date; }).getTime();
        var maxDate = d3.max(data, function (d) { return d.Date; }).getTime();
        $("#SliderLable").text(toreadDate(minDate) + " - " + toreadDate(maxDate));

        $("#dateRangeSlider").slider({
            range: true,
            min: minDate,
            max: maxDate,
            animate: "fast",
            step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                totalVACases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1000 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#realChart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var x = d3.scaleBand()
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .range([height, 0]);


    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 70)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Date");


    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Total Reported Cases Virginia");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")");


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function totalVACases(data) {

        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.CasesVA; })]);

        //console.log(data.map(function (d) {return  (d.Date);}));

        // x Axis
        var xAsisCall = d3.axisBottom(x);
        xAsisGroup.transition().call(xAsisCall)
            .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        //y Axis
        var yAxisCall = d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
        yAxisGroup.transition().call(yAxisCall)

        //Data Join
        var rects = g.selectAll("rect")
            .data(data)
        //Exit remove old elements as needed
        rects.exit().remove();

        //UPDATE update old elements as needed
        rects
            .transition()
            .attr("y", function (d) { return y(d.CasesVA); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.CasesVA); })
            .attr("width", x.bandwidth)

        //ENTER create new elements as needed

        rects.enter()
            .append("rect")
            .attr("y", function (d) { return y(d.CasesVA); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.CasesVA); })
            .attr("width", x.bandwidth)
            .attr("fill", "#003366")
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);


        var div = d3.select('#container').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');
        function mouseover() {

            div.style('display', 'inline');
        }
        function mousemove() {
            var d = d3.select(this).data()[0]
            div
                // .html(d.Date + '<hr/>' + d.CasesUS)
                .html("Total Cases: " + formatC(d.CasesVA) + '<hr>' + "Daily Growth: " + formatP(d.GrowthVA))
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }
        function mouseout() {
            div.style('display', 'none');
        }




    };
}





function USCases() {
    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.Date = parseTime(d.Date);
        });

        dataToSlider(data);
        totalVACases(data);

    }).catch(function (error) {
        console.log(error);
    });


    function dataToSlider(data) {
        var minDate = d3.min(data, function (d) { return d.Date; }).getTime();
        var maxDate = d3.max(data, function (d) { return d.Date; }).getTime();
        $("#SliderLable").text(toreadDate(minDate) + " - " + toreadDate(maxDate));

        $("#dateRangeSlider").slider({
            range: true,
            min: minDate,
            max: maxDate,
            animate: "fast",
            step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                totalVACases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1000 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#realChart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var x = d3.scaleBand()
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .range([height, 0]);


    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    g.append("text")
        .attr("class", "x axis-label")
        .attr("x", width / 2)
        .attr("y", height + 70)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Date");


    g.append("text")
        .attr("class", "y axis-label")
        .attr("x", -(height / 2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Total Reported Cases Virginia");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")");


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function totalVACases(data) {

        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.CasesUS; })]);

        //console.log(data.map(function (d) {return  (d.Date);}));

        // x Axis
        var xAsisCall = d3.axisBottom(x);
        xAsisGroup.transition().call(xAsisCall)
            .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        //y Axis
        var yAxisCall = d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
        yAxisGroup.transition().call(yAxisCall)

        //Data Join
        var rects = g.selectAll("rect")
            .data(data)
        //Exit remove old elements as needed
        rects.exit().remove();

        //UPDATE update old elements as needed
        rects
            .transition()
            .attr("y", function (d) { return y(d.CasesUS); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.CasesUS); })
            .attr("width", x.bandwidth)

        //ENTER create new elements as needed

        rects.enter()
            .append("rect")
            .attr("y", function (d) { return y(d.CasesUS); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.CasesUS); })
            .attr("width", x.bandwidth)
            .attr("fill", "#003366")
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);


        var div = d3.select('#container').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');
        function mouseover() {

            div.style('display', 'inline');
        }
        function mousemove() {
            var d = d3.select(this).data()[0]
            div
                // .html(d.Date + '<hr/>' + d.CasesUS)
                .html("Total Cases: " + formatC(d.CasesUS) + '<hr>' + "Daily Growth: " + formatP(d.GrowthUS))
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }
        function mouseout() {
            div.style('display', 'none');
        }




    };
   
}






///------- line charts -------////

function dailyGrowth() {
    var margin = { left: 80, right: 100, top: 50, bottom: 100 },
        height = 500 - margin.top - margin.bottom,
        width = 800 - margin.left - margin.right;

    var svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left +
            ", " + margin.top + ")");

    var t = function () { return d3.transition().duration(1000); }

    var parseTime = d3.timeParse("%d/%m/%Y");
    var formatTime = d3.timeFormat("%d/%m/%Y");
    var bisectDate = d3.bisector(function (d) { return d.date; }).left;

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
        .attr("transform", "translate(0," + height + ")");

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
        slide: function (event, ui) {
            $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
            $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
            update();
        }
    });

    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        // console.log(data);

        // Prepare and clean data
        filteredData = {};
        for (var coin in data) {
            if (!data.hasOwnProperty(coin)) {
                continue;
            }
            filteredData[coin] = data[coin].filter(function (d) {
                return !(d["price_usd"] == null)
            })
            filteredData[coin].forEach(function (d) {
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
        var dataTimeFiltered = filteredData[coin].filter(function (d) {
            return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
        });

        // Update scales
        x.domain(d3.extent(dataTimeFiltered, function (d) { return d.date; }));
        y.domain([d3.min(dataTimeFiltered, function (d) { return d[yValue]; }) / 1.005,
        d3.max(dataTimeFiltered, function (d) { return d[yValue]; }) * 1.005]);

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
            .on("mouseover", function () { focus.style("display", null); })
            .on("mouseout", function () { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(dataTimeFiltered, x0, 1),
                d0 = dataTimeFiltered[i - 1],
                d1 = dataTimeFiltered[i],
                d = (d1 && d0) ? (x0 - d0.date > d1.date - x0 ? d1 : d0) : 0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d[yValue]) + ")");
            focus.select("text").text(function () { return d3.format("$,")(d[yValue].toFixed(2)); });
            focus.select(".x-hover-line").attr("y2", height - y(d[yValue]));
            focus.select(".y-hover-line").attr("x2", -x(d.date));
        }

        // Path generator
        line = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d[yValue]); });

        // Update our line path
        g.select(".line")
            .transition(t)
            .attr("d", line(dataTimeFiltered));

        // Update y-axis label
        var newText = (yValue == "price_usd") ? "Price (USD)" :
            ((yValue == "market_cap") ? "Market Capitalization (USD)" : "24 Hour Trading Volume (USD)")
        yLabel.text(newText);
    }




};


