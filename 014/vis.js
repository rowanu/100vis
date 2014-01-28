/*jslint browser: true, todo: true */
/*globals d3 */
var dateParse =  d3.time.format('%Y-%m-%d').parse;

var data,
  margin = {top: 20, right: 80, bottom: 30, left: 60},
  width = 960,
  height = 500;

var x = d3.time.scale()
  .range([0, width - margin.left - margin.right]);

var xAxis = d3.svg.axis()
  .scale(x)
  .tickFormat(d3.time.format('%b'))
  .orient('bottom');

// Price
var y = d3.scale.linear()
  .range([height - margin.top - margin.bottom, 0]);

var yAxis = d3.svg.axis()
  .scale(y)
  .tickFormat(function (d) { return '$' + d; })
  .orient('left');

// Volume
var y2 = d3.scale.linear()
  .range([height - margin.top - margin.bottom, 0]);

var y2Axis = d3.svg.axis()
  .scale(y2)
  .tickFormat(function (d) { return (d / 1000) + 'K'; })
  .orient('right');

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
      price: +d.Close,
      volume: +d.Volume
    };
  });

  x.domain(d3.extent(data, function (d) { return d.date; })).nice();
  y.domain(d3.extent(data, function (d) { return d.price; }));
  y2.domain(d3.extent(data, function (d) { return d.volume; }));

  svg.selectAll('rect.bar')
      .data(data)
    .enter().append('svg:rect')
      .attr('class', 'bar')
      .attr('x', function (d) { return x(d.date); })
      .attr('y', function (d) { return height - margin.top - margin.bottom - y2(d.volume); })
      .attr('width', function () { return (width - margin.left - margin.right) / (data.length + 2); })
      .attr('height', function (d) { return y2(d.volume); })
  svg.append('path')
      .attr('class', 'line')
      .attr('d', line(data));

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - margin.top - margin.bottom) + ')')
      .call(xAxis);
  svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(-5,0)')
      .call(yAxis);
  svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (width - margin.left - margin.right + 10) + ',0)')
      .call(y2Axis);
});
