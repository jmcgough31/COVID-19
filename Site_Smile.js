
 
const svg = d3.select('svg');
const height =+svg.attr('height');
const width = +svg.attr('width');

const g = svg.append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`);

const circle = g.append('circle')
    .attr('r',height/2)    
    .attr('fill', 'yellow')
    .attr('stroke', 'black');

const eyespacing = 100;
const eyeradius = 50;
const eyeYoffset = -70;
const eyebrowwidth = 70;
const eyebrowheight = 15;
const eyebrowYoffset = -90

const eyesG = g
    .append('g')
        .attr('transform', `translate(0, ${eyeYoffset})`);

const leftEye = eyesG   
    .append('circle')
        .attr('r',eyeradius)
        .attr('cx', -eyespacing)         

const rightEye = eyesG
    .append('circle')
        .attr('r',eyeradius)
        .attr('cx', eyespacing)  
        
const eyebrowsG = eyesG
    .append('g')
      .attr('transform', `translate(0, ${eyebrowYoffset})`);

eyebrowsG      
      .transition().duration(2000)
         .attr('transform', `translate(0, ${eyebrowYoffset - 50})`)
     .transition().duration(2000)
        .attr('transform', `translate(0, ${eyebrowYoffset})`);

const leftEyebrow = eyebrowsG   
    .append('rect')
        .attr('x', -eyespacing - eyebrowwidth /2)
       
        .attr('width', eyebrowwidth)
        .attr('height', eyebrowheight);

const rightEyebrow = eyebrowsG  
    .append('rect')
        .attr('x', +eyespacing - eyebrowwidth /2)
      
        .attr('width', eyebrowwidth)
        .attr('height', eyebrowheight);
   
  


const mouth = g
    .append('path')
        .attr('d', d3.arc()({
            innerRadius: 150,
            outerRadius: 170,
            startAngle: Math.PI /2,
            endAngle: Math.PI * 3/2
        }));