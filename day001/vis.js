/*jslint browser: true */
/*globals d3 */
var dateParser = d3.time.format('%Y-%m-%d %H:%M:%S').parse;
function render(data, selector) {
  // Cast the data
  data.forEach(function (d) {
    d.average = +d.average;
    d.datetime = dateParser(d.datetime);
  });

  var margin = {top: 20, right: 10, bottom: 20, left: 10},
    start = d3.min(data, function (d) { return d.datetime; }),
    end = d3.max(data, function (d) { return d.datetime; }),
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var xScale = d3.time.scale()
    .domain([start, end])
    .range([0, width]);

  var yScale = d3.scale.linear()
    .domain(d3.extent(data, function (d) { return d.average; }))
    .range([height, 0]);

  var line = d3.svg.line()
    .x(function (d) { return xScale(new Date(d.datetime)); })
    .y(function (d) { return yScale(d.average); });

  var svg = d3.select(selector).append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.left + ')');

  svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);
}

d3.csv('https://api.bitcoinaverage.com/history/USD/per_minute_24h_sliding_window.csv', function (err, data) {
  if (err) { console.error(err); }
  render(data, '#chart');
});
