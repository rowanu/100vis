/*jslint browser: true, todo: true */
/*globals d3 */
var dateParse =  d3.time.format('%Y-%m-%d').parse;

var data,
  margin = {top: 20, right: 30, bottom: 30, left: 60},
  width = 960,
  height = 500;

var x = d3.time.scale()
  .range([0, width - margin.left - margin.right]);

var xAxis = d3.svg.axis()
  .scale(x)
  .tickFormat(d3.time.format('%U'))
  .orient('bottom');

// Price
var y = d3.scale.linear()
  .range([height - margin.top - margin.bottom, 0]);

var yAxis = d3.svg.axis()
  .scale(y)
  .tickFormat(function (d) { return '$' + d; })
  .orient('left');

// TODO: Volume axis/scale

var svg = d3.select('#container')
    .append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
var line = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });

d3.csv('yelp-2013.csv', function (err, prices) {
  if (err) { console.error(err); }
  data = prices.map(function (d) {
    return {
      date: dateParse(d.Date),
      price: +d.Close
    };
  });

  x.domain(d3.extent(data, function (d) { return d.date; }));
  y.domain(d3.extent(data, function (d) { return d.price; }));

  svg.append('path')
      .attr('class', 'line')
      .attr('d', line(data));
  svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(-5,0)')
      .call(yAxis);
  console.log(height - margin.top - margin.bottom);
  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis);
});
