// @TODO: YOUR CODE HERE!

// create variable for the SVG
var svgWidth = 960;
var svgHeight = 620;

// create margin definitions
var margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

// set chart height & width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// div to hold the scatter element
var chart = d3.select('#chart')
  .append('div')
  .classed('chart', true);

// variable to hold the SVG chart 
var svg = chart.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

  // Create X and Y axis for poverty and healthcare
var bottomXaxis = 'poverty';
var leftYaxis = 'healthcare';

// Add SVG Group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);


// Create function to update the y axis variable when user clicks the y label
function yScale(Data, leftYaxis) {
  //scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[leftYaxis]) * 0.8,
      d3.max(Data, d => d[leftYaxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}

//create function to update the x axis variable when user clicks the x label
function xScale(Data, bottomXaxis) {

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[bottomXaxis]) * 0.8,
        d3.max(Data, d => d[bottomXaxis]) * 1.2])
      .range([0, width]);

    return xLinearScale;
}

//create function to update the x axis when user clicks on it
function scaleYaxis(updatedXScale, xAxis) {
  var bottomAxis = d3.axisBottom(updatedXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//create function to update the y axis when user clicks on it.
function scaleYAxis(updatedYScale, yAxis) {
  var leftAxis = d3.axisLeft(updatedYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//create function to update the circles when transitionaling to other circles 
function updateCircles(circlesGroup, updatedXScale, bottomXaxis, updatedYScale, leftYaxis) {
// Transition of circle group
    circlesGroup.transition()
      .duration(2000)
      .attr('cx', data => updatedXScale(data[bottomXaxis]))
      .attr('cy', data => updatedYScale(data[leftYaxis]))

    return circlesGroup;
}

//create function to update the "State" labels
function updateText(textGroup, updatedXScale, bottomXaxis, updatedYScale, leftYaxis) {
// transition textgroup to align with circuit group
    textGroup.transition()
      .duration(2000)
      .attr('x', d => updatedXScale(d[bottomXaxis]))
      .attr('y', d => updatedYScale(d[leftYaxis]));

    return textGroup
}
//create function to stylize tooptips
function style(value, bottomXaxis) {

    if (bottomXaxis === 'poverty') {
        return `${value}%`;
    }
    else if (bottomXaxis === 'income') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//create funtion to update circles group
function updateToolTip(bottomXaxis, leftYaxis, circlesGroup) {

// X axis
    if (bottomXaxis === 'poverty') {
      var xLabel = 'Poverty:';
    }
    else if (bottomXaxis === 'income'){
      var xLabel = 'Median Income:';
    }
    else {
      var xLabel = 'Age:';
    }
// Y axis
  if (leftYaxis ==='healthcare') {
    var yLabel = "No Healthcare:"
  }
  else if(leftYaxis === 'obesity') {
    var yLabel = 'Obesity:';
  }
  else{
    var yLabel = 'Smokers:';
  }

  // Add tooltips for each state data
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${style(d[bottomXaxis], bottomXaxis)}<br>${yLabel} ${d[leftYaxis]}%`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//retrieve data
d3.csv('./assets/data/data.csv').then(function(Data) {

    // analyse data
    Data.forEach(function(data){
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;

    });
  
    // verify data in console
  console.log(Data);

    //create linear for x and y scales
    var xLinearScale = xScale(Data, bottomXaxis);
    var yLinearScale = yScale(Data, leftYaxis);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis to chartgroup
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    // append Y axis to chartgroup
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    // append circles to chartgroup in state circles
    var circlesGroup = chartGroup.selectAll('circle')
      .data(Data)
      .enter()
      .append('circle')
      .classed('Circles', true)
      .attr('cx', d => xLinearScale(d[bottomXaxis]))
      .attr('cy', d => yLinearScale(d[leftYaxis]))
      .attr('r', 18)
      .attr('opacity', '.7');

    // append text to chartgroup in StateText
    var textGroup = chartGroup.selectAll('.StateText')
      .data(Data)
      .enter()
      .append('text')
      .classed('StateText', true)
      .attr('x', d => xLinearScale(d[bottomXaxis]))
      .attr('y', d => yLinearScale(d[leftYaxis]))
      .attr('dy', 3)
      .attr('font-size', '12px')
      .text(function(d){return d.abbr});

    // create x axis label group
    var xAxisGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var poverty = xAxisGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty')
      .text('In Poverty (%)');
      
    var age = xAxisGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age')
      .text('Age (Median)');  

    var income = xAxisGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income')
      .text('Household Income (Median)')

    // create y axis label group
    var yAxisGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var healthcare = yAxisGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 20)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'healthcare')
      .text('Lacks Healthcare (%)');
    
    var smoker = yAxisGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 40)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'smokes')
      .text('Smoker (%)');
    
    var obese = yAxisGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 60)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'obesity')
      .text('Obese (%)');
    
    // Tool tip update  
    var circlesGroup = updateToolTip(bottomXaxis, leftYaxis, circlesGroup);


    // create event listener for y axis lables
    yAxisGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=leftYaxis) {
            // replace chosenY with value  
            leftYaxis = value;

            // update Y scale
            yLinearScale = yScale(Data, leftYaxis);

            // update Y axis 
            yAxis = scaleYAxis(yLinearScale, yAxis);

            // udate circles with new y
            circlesGroup = updateCircles(circlesGroup, xLinearScale, bottomXaxis, yLinearScale, leftYaxis);

            // update text with new Y values
            textGroup = updateText(textGroup, xLinearScale, bottomXaxis, yLinearScale, leftYaxis);

            // update tool tips
            circlesGroup = updateToolTip(bottomXaxis, leftYaxis, circlesGroup);

            // when classes change from active to inactive, change text
            if (leftYaxis === 'obesity') {
              obese.classed('active', true).classed('inactive', false);
              smoker.classed('active', false).classed('inactive', true);
              healthcare.classed('active', false).classed('inactive', true);
            }
            else if (leftYaxis === 'smokes') {
              obese.classed('active', false).classed('inactive', true);
              smoker.classed('active', true).classed('inactive', false);
              healthcare.classed('active', false).classed('inactive', true);
            }
            else {
              obese.classed('active', false).classed('inactive', true);
              smoker.classed('active', false).classed('inactive', true);
              healthcare.classed('active', true).classed('inactive', false);
            }
          }
        });
        
    // create event listener for x axis
    xAxisGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != bottomXaxis) {

          // replace selected x with a value
          bottomXaxis = value; 

          // update x scale for new data
          xLinearScale = xScale(Data, bottomXaxis);

          // update x axis 
          xAxis = scaleYaxis(xLinearScale, xAxis);

          // upate circles with new value in x axis
          circlesGroup = updateCircles(circlesGroup, xLinearScale, bottomXaxis, yLinearScale, leftYaxis);

          // update text 
          textGroup = updateText(textGroup, xLinearScale, bottomXaxis, yLinearScale, leftYaxis);

          // update tooltip
          circlesGroup = updateToolTip(bottomXaxis, leftYaxis, circlesGroup);

          // if change classes, then change text
          if (bottomXaxis === 'poverty') {
            poverty.classed('active', true).classed('inactive', false);
            age.classed('active', false).classed('inactive', true);
            income.classed('active', false).classed('inactive', true);
          }
          else if (bottomXaxis === 'age') {
            poverty.classed('active', false).classed('inactive', true);
            age.classed('active', true).classed('inactive', false);
            income.classed('active', false).classed('inactive', true);
          }
          else {
            poverty.classed('active', false).classed('inactive', true);
            age.classed('active', false).classed('inactive', true);
            income.classed('active', true).classed('inactive', false);
          }
        }
      });
    
    
});