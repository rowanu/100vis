/*jslint browser: true */
/*globals _, d3, moment */
var height = 500,
  width = 960,
  margin = {top: 10, right: 10, bottom: 30, left: 50},
  timeFormatter = d3.time.format('%H:%M'),
  h = height - margin.top - margin.bottom,
  w = width - margin.left - margin.right;

var c = d3.scale.category10();
var x = d3.time.scale()
  .domain([moment().startOf('day'), moment().endOf('day')])
  .range([0, w]);
  
var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(d3.time.hours, 3)
  .tickFormat(timeFormatter)
  .orient('bottom');

var y = d3.scale.ordinal()
  .rangeRoundBands([0, h], 0.05);

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

var svg = d3.select('#container').append('svg')
    .attr('height', height)
    .attr('width', width)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis);

var line = d3.svg.line()
  .x(function () { return x(moment()); })
  .y(function (d) { return height * d; });

d3.json('markets.json', function (markets) {
  y.domain(markets.map(function (e) { return e.name; }));

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  // Extract sessions for each market
  var sessions = [];
  _.each(markets, function (e) {
    _.each(e.sessions, function (s) {
      sessions.push(_.extend({name: e.name}, s));
    });
  });

  var bars = svg.selectAll('rect.bar')
      .data(sessions);

  bars.enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) { return x(moment(d.start, 'HH:mm')); })
    .attr('width', function (d) { return x(moment(d.start, 'HH:mm').startOf('hour').add(moment.duration(d.duration, 'HH:mm'))) - x(moment(d.start, 'HH:mm').startOf('hour')); })
    .attr('y', function (d) { return y(d.name); })
    .attr('fill', function (d) { return c(d.status); })
    .attr('height', y.rangeBand());

  svg.append('path')
    .attr('class', 'rule')
    .attr('d', line([0, 1]));
});
