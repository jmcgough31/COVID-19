
d3.csv("testCOVID-DataV2.csv").then(function(data){
    data.forEach(function(d){
        d.Cases = +d.Cases
    })
    console.log(data);

var margin = {left:100, right:10, top:10, bottom:100};

 var width = 1000 - margin.left - margin.right;
 var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#realChart-area")
    .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom);
   
   

   var g = svg.append("g")   
   .attr("transform", "translate("+ margin.left +"," + margin.top +")" );

   g.append("rect")
    .attr("x",0)
    .attr("y",0 )
    .attr("width", width)
    .attr("height", height)
    .attr("fill","#d1d1d1");


   g.append("text")
        .attr("class","x axis-label")
        .attr("x", width  /2)
        .attr("y", height + 70)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Date");

        g.append("text")
        .attr("class","y axis-label")
        .attr("x", -(height  /2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Total Reported Cases");

var x = d3.scaleBand()
    .domain(data.map(function(d){
        return d.Date
    }))
    .range([0,width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d){
        return d.Cases;
    })])
    .range([height , 0]);

var xAsisCall = d3.axisBottom(x);
g.append("g")  
    .attr("class", "xaxis")
    .attr("transform", "translate(0, "+ height+")")
    .call(xAsisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");


 var yAxisCall = d3.axisLeft(y)       
        .ticks(10)       
        .tickSize(-width)
       g.append("g")       
       .attr("class", "yaxis")   
       .call(yAxisCall)
          
       
    

 var rects = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d){
             return y(d.Cases);
            })
        .attr("x", function(d){
            return x(d.Date);
        })
        
        .attr("height", function(d){
            return height- y(d.Cases);
        })
        .attr("width", x.bandwidth)
        .attr("fill", "#003366")


}).catch(function(error){
    console.log(error);
});