


d3.json("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/03/3.07/data/buildings.json").then(function(data){
    data.forEach(function(d){
        d.height = +d.height;
    });
    console.log(data);

    var margin = {left:100, right:10, top:10, bottom:150};

    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#practiceChart-area")
    .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom);

   var g = svg.append("g")
        .attr("transform", "translate("+ margin.left +"," + margin.top +")" );

    g.append("text")
        .attr("class","x axis-label")
        .attr("x", width  /2)
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("The World's Tallest Buildings");

        g.append("text")
        .attr("class","y axis-label")
        .attr("x", -(height  /2))
        .attr("y", -60)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Height (m)");
    

   var x = d3.scaleBand()
   .domain(data.map(function(d){
       return d.name;
   }))
   .range([0, width])
   .paddingInner(0.3)
   .paddingOuter(0.3);

   var y = d3.scaleLinear()
   .domain([0, d3.max(data, function(d){
       return d.height;
   })])
   .range([height, 0]);

   var xAxisCall = d3.axisBottom(x);
   g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)");

   var yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(function(d){
        return d + "m"
    });
   g.append("g")
   .attr("class", "y axis")   
   .call(yAxisCall);

    var rects = g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d){
            return y(d.height);
        })
        .attr("x", function(d,i){
            return x(d.name);
        })        
        .attr("height", function(d){
            return height - y(d.height)
        })
        .attr("width", x.bandwidth)
        .attr("fill","gray")


}).catch(function(error){
    console.log(error);
});

// d3.csv("https://raw.githubusercontent.com/adamjanes/udemy-d3/master/02/2.07/data/ages.csv").then(function(data){
//     data.forEach(function(d){
//         d.age = +d.age
//     });
    

//     var svg = d3.select("#practiceChart-area").append("svg")
//     .attr("width", 400)
//     .attr("height", 400);


// var circles = svg.selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("cx", function(d, i){
//         console.log(d)
//         return (i*50)+25;
//     })
//     .attr("cy", 100)
//     .attr("r", function (d){
//         return d.age *2;
//     })
//     .attr("fill", function(d){
//         if(d.name =="Tony"){
//             return "blue";
//         }
//         else{
//             return "red"
//         }
//     });

// }).catch(function(error){
//     console.log(erro);
// })



// var circle =svg.append("circle")
//     .attr("cx" ,100)
//     .attr("cy", 250)
//     .attr("r", 70)
//     .attr("fill", "gray");

// var rect = svg.append("rect")
//     .attr("width", 130)
//     .attr("height", 40)
//     .attr("x", 10)
//     .attr("y", 20)
//     .attr("fill", "gray");