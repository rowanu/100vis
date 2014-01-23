/*jslint browser: true */
/*globals d3 */
var dateParser = d3.time.format('%Y-%m-%d %H:%M:%S').parse;

function render(data, selector) {
  // Cast the data
  data.forEach(function (d) {
    d.average = +d.average;
    d.datetime = dateParser(d.datetime);
  });

  var margin = {top: 30, right: 30, bottom: 40, left: 50},
    offset = 10,
    start = d3.min(data, function (d) { return d.datetime; }),
    end = d3.max(data, function (d) { return d.datetime; }),
    width = 960,
    height = 500,
    w = 960 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

  var xScale = d3.time.scale()
    .domain([start, end])
    .range([offset, w - offset]);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');

  var yScale = d3.scale.linear()
    .domain(d3.extent(data, function (d) { return d.average; }))
    .range([h - offset, offset]);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  var line = d3.svg.line()
    .x(function (d) { return xScale(new Date(d.datetime)); })
    .y(function (d) { return yScale(d.average); });

  var svg = d3.select(selector).append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  // Axes
  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis);
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  var path = svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);

  var totalLength = path.node().getTotalLength();

  path
    .attr('stroke-dasharray', totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
      .duration(2000)
      .ease('linear')
      .attr('stroke-dashoffset', 0);
}

d3.csv('https://api.bitcoinaverage.com/history/USD/per_minute_24h_sliding_window.csv', function (err, data) {
  if (err) { console.error(err); }
  render(data, '#chart');
});
