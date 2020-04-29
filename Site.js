// TODO find out why slider max date is one day off when slider is used.


$(document).ready(function () {
    USCases();
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

        }
        else if (valueofbox == "USGrowth") {
            $("#realChart-area").empty();
            dailyGrowthUS();

        }  
        else if (valueofbox == "USNew") {
            $("#realChart-area").empty();
            USCasesNew();
        }      
        else if (valueofbox == "VANew") {
            $("#realChart-area").empty();
            VACasesNew();
        }   
        else if (valueofbox == "VADeaths") {
            $("#realChart-area").empty();
            VADeaths();
        }   
        else if (valueofbox == "USDeaths") {
            $("#realChart-area").empty();
            USDeaths();
        } 
        else {
        }
    });
});


var formatC = d3.format(",");
var formatP = d3.format(".2%");
var parseTime = d3.timeParse("%m/%d/%Y");
var toreadDate = d3.timeFormat("%m/%d/%Y");
var formatPercentage = d3.format(".0%");


function USCases() {
    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.Date = parseTime(d.Date);
        });

        dataToSlider(data);
        totalUSCases(data);

    }).catch(function (error) {
        console.log(error);
    });


    function dataToSlider(data) {
        var minDate = d3.min(data, function (d) { return d.Date; }).getTime();
        console.log(minDate)
        var maxDate = d3.max(data, function (d) { return d.Date; }).getTime();
        $("#SliderLable").text(toreadDate(minDate) + " - " + toreadDate(maxDate));

        $("#dateRangeSlider").slider({
            range: true,
            min: minDate,
            max: maxDate,
            animate: "fast",          
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                count = dataFiltered.length;
                
                totalUSCases(dataFiltered, count);

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
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
        .text("Total Reported Cases U.S.");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")")    


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function totalUSCases(data, count) {
        console.log(count);
        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.CasesUS; }) + (d3.max(data, function (d) { return d.CasesUS; })/50) ]);

        //console.log(data.map(function (d) {return  (d.Date);}));

        // x Axis
        var xAsisCall = d3.axisBottom(x);
        xAsisGroup.transition().call(xAsisCall)
            .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")           
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)") 
            // .style("fill", function(){
            //     if(count > 40){
            //         return "none"
            //     }
            //     else{
            //         return "black"
            //     }
            // } );
          

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

function USCasesNew() {
    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.Date = parseTime(d.Date);
                d.NewUSCases = +d.NewUSCases;
        });

        dataToSlider(data);
        totalNewUSCases(data);

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
           // step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                totalNewUSCases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
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
        .text("Daily New Cases U.S.");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")");


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function  totalNewUSCases(data) {

        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.NewUSCases; }) + d3.max(data, function (d) { return d.NewUSCases; })/50 ]);

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
            .attr("y", function (d) { return y(d.NewUSCases); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.NewUSCases); })
            .attr("width", x.bandwidth)

        //ENTER create new elements as needed

        rects.enter()
            .append("rect")
            .attr("y", function (d) { return y(d.NewUSCases); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.NewUSCases); })
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
                .html("Total Cases: " + formatC(d.NewUSCases) + '<hr>' + "Daily Growth: " + formatP(d.GrowthUS))
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }
        function mouseout() {
            div.style('display', 'none');
        }




    };

}

function USDeaths() {
    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.DeathsUS = +d.DeathsUS,
                d.Date = parseTime(d.Date);
                d.NewUSCases = +d.NewUSCases;
        });

        dataToSlider(data);
        totalNewUSCases(data);

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
           // step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                totalNewUSCases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
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
        .text("Total Reported Deaths U.S.");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")");


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function  totalNewUSCases(data) {

        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.DeathsUS; }) + d3.max(data, function (d) { return d.DeathsUS; })/50 ]);

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
            .attr("y", function (d) { return y(d.DeathsUS); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.DeathsUS); })
            .attr("width", x.bandwidth)

        //ENTER create new elements as needed

        rects.enter()
            .append("rect")
            .attr("y", function (d) { return y(d.DeathsUS); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.DeathsUS); })
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
                .html("Deaths: " + formatC(d.DeathsUS) )
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }
        function mouseout() {
            div.style('display', 'none');
        }




    };

}

function VACasesNew() {
    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.Date = parseTime(d.Date);
                d.NewUSCases = +d.NewUSCases;
                d.NewVACases = +d.NewVACases;
        });

        dataToSlider(data);
        totalNewVACases(data);

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
          //  step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                totalNewVACases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
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
        .text("Daily New Cases V.A.");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")");


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function  totalNewVACases(data) {

        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.NewVACases; }) + (d3.max(data, function (d) { return d.NewVACases; })/50) ]);

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
            .attr("y", function (d) { return y(d.NewVACases); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.NewVACases); })
            .attr("width", x.bandwidth)

        //ENTER create new elements as needed

        rects.enter()
            .append("rect")
            .attr("y", function (d) { return y(d.NewVACases); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.NewVACases); })
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
                .html("Total Cases: " + formatC(d.NewVACases) + '<hr>' + "Daily Growth: " + formatP(d.GrowthVA))
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }
        function mouseout() {
            div.style('display', 'none');
        }




    };

}

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
            //step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
               // console.log(dataFiltered);
                totalVACases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#realChart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
       

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
        y.domain([0, d3.max(data, function (d) { return d.CasesVA; }) + d3.max(data, function (d) { return d.CasesVA;})/50 ]);

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




    }
}

function VADeaths() {

    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.DeathsUS = +d.DeathsUS,
                d.CasesUS = +d.CasesUS,
                d.CasesVA = +d.CasesVA,
                d.DeathsVA =+d.DeathsVA,
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
            //step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
               // console.log(dataFiltered);
                totalVACases(dataFiltered)

            }
        })
    }

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#realChart-area")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
       

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
        .text("Total Reported Deaths Virginia");

    var xAsisGroup = g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0, " + height + ")");


    var yAxisGroup = g.append("g")
        .attr("class", "yaxis");


    function totalVACases(data) {

        x.domain(data.map(function (d) { return toreadDate(d.Date); }));
        y.domain([0, d3.max(data, function (d) { return d.DeathsVA; }) + d3.max(data, function (d) { return d.DeathsVA;})/50 ]);

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
            .attr("y", function (d) { return y(d.DeathsVA); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.DeathsVA); })
            .attr("width", x.bandwidth)

        //ENTER create new elements as needed

        rects.enter()
            .append("rect")
            .attr("y", function (d) { return y(d.DeathsVA); })
            .attr("x", function (d) { return x(toreadDate(d.Date)); })
            .attr("height", function (d) { return height - y(d.DeathsVA); })
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
                .html("Total Deaths: " + formatC(d.DeathsVA))
                .style('left', (d3.event.pageX - 34) + 'px')
                .style('top', (d3.event.pageY - 12) + 'px');
        }
        function mouseout() {
            div.style('display', 'none');
        }

    }
}

///------- line charts -------////

function dailyGrowthUS() {

    d3.csv("testCOVID-DataV2.csv").then(function (data) {
        data.forEach(function (d) {
            d.Date = parseTime(d.Date);
            d.GrowthUS = +d.GrowthUS;
        });
        

        totalDailyGrowth(data);
        dataToSlider(data);

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
          //  step: 86400000, // One day
            values: [minDate, maxDate],
            slide: function (event, ui) {
                $("#SliderLable").text(toreadDate(new Date(ui.values[0])) + " - " + toreadDate(new Date(ui.values[1])));
                var sliderValues = $("#dateRangeSlider").slider("values");
                dataFiltered = data.filter(function (d) {
                    return ((d.Date >= sliderValues[0]) && (d.Date <= sliderValues[1]))
                });
                //console.log(dataFiltered);
                lineUpdate(dataFiltered)

            }
        })
    }

    // set the dimensions and margins of the graph
    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 1200 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;


    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function (d) { return x(d.Date); })
        .y(function (d) { return y(d.GrowthUS); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#realChart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        .attr("y", -140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("U.S. Daily Growth Rate");


    // Add the x Axis
    var xAsisGroup = svg.append("g")
        .attr("transform", "translate(0," + height + ")");
        
      //  .call(d3.axisBottom(x)
           

    // Add the y Axis
    var yAxisGroup =  svg.append("g")         


    function totalDailyGrowth(data) {
        // Scale the range of the data
        x.domain(d3.extent(data, function (d) { return d.Date; }));
        y.domain([0, d3.max(data, function (d) { return d.GrowthUS; })]);

        var xAsisCall = d3.axisBottom(x)      
        .tickFormat(toreadDate);
      

        xAsisGroup.transition().call(xAsisCall)
        .selectAll("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)") ;
       // .tickFormat(d3.timeFormat("%Y-%m-%d"));

        var yAxisCall = d3.axisLeft(y).ticks(null, "%");
        // .ticks(10)
        // .tickSize(-width);
         yAxisGroup.transition().call(yAxisCall);

        // Add the valueline path.

     var path = svg.append("path")     
        .attr("class", "line")
        .attr("d", valueline(data))        
        .attr("fill", "none")
        .attr("stroke", "#003366");


    }

    function lineUpdate(data){
        x.domain(d3.extent(data, function (d) { return d.Date; }));
        y.domain([0, d3.max(data, function (d) { return d.GrowthUS; })]);

        var svg = d3.select("body").transition();

        svg.select(".line")
            .attr("d",valueline(data))

            var xAsisCall = d3.axisBottom(x)      
            .tickFormat(toreadDate);          
    
            xAsisGroup.transition().call(xAsisCall)
            .selectAll("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");          
    
            var yAxisCall = d3.axisLeft(y).ticks(null, "%");          
             yAxisGroup.transition().call(yAxisCall);

    }


}


