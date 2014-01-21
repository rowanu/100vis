/*jslint browser: true */
/*globals d3 */
var dateParser = d3.time.format('%Y-%m-%d %H:%M:%S').parse,
  bisectDate = d3.bisector(function(d) { return d.datetime;  }).left;

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

  // Line
  svg.append('path')
    .datum(data)
    .attr('class', 'line')
    .attr('d', line);

  // Mouseover
  var focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

  focus.append('circle')
      .attr('r', 5);

  focus.append('text')
      .attr('x', 5)
      .attr('dy', '1em');
  
  function mousemove() {
    var x0 = xScale.invert(d3.mouse(this)[0] + offset),
      i = bisectDate(data, x0, 1), 
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0;
    focus.attr('transform', 'translate(' + xScale(d.datetime) + ',' + yScale(d.average) + ')');
    focus.select('text').text('$' + d3.format('.2f')(d.average));
      
  }

  svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', w - 2 * offset)
      .attr('height', h - 2 * offset)
      .attr('transform', 'translate(' + offset + ',' + offset + ')')
      .on('mouseover', function () { focus.style('display', null); })
      .on('mouseout', function () { focus.style('display', 'none'); })
      .on('mousemove', mousemove);
}

// d3.csv('https://api.bitcoinaverage.com/history/USD/per_minute_24h_sliding_window.csv', function (err, data) {
d3.csv('/per_minute_24h_sliding_window.csv', function (err, data) {
  if (err) { console.error(err); }
  render(data, '#chart');
});
