/*jslint browser: true, todo: true */
/*globals d3 */

var parseDate =  d3.time.format('%Y/%m/%d').parse;

function render(data, selector) {
  // Cast
  data.forEach(function (d) {
    d.Period = parseDate(d.Period);
    d.Males = +d.Males;
    d.Femals = +d.Females;
    d.Persons = +d.Persons;
  });

  // Settings
  var margin = {top: 20, right: 20, bottom: 50, left: 50},
    padding = 0.5,
    fullWidth = 1020, fullHeight = 500,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom,
    barWidth = (width / data.length) - (2 * padding);

  var x = d3.time.scale()
    .domain(d3.extent(data, function (d) { return d.Period; }))
    .nice(d3.time.month, 4)
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%b'%y"))
    .orient('bottom');

  var y = d3.scale.linear()
    .domain(d3.extent(data, function (d) { return d.Persons; }))
    .range([height, 0]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var svg = d3.select(selector)
    .append('svg')
      .attr('width', fullWidth)
      .attr('heigh', fullHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

  svg.selectAll('rect.bars')
      .data(data)
    .enter()
    .append('rect')
      .attr('x', function (d) { return x(d.Period); })
      .attr('y', function (d) { return y(d.Persons); })
      .attr('height', function (d) { return height - y(d.Persons); })
      .attr('width', barWidth)
      .attr('text', function (d) { return d.Period + ': ' + d.Persons; })
      .attr('class', 'bar');

}

d3.csv('data/australian_unemployed_by_sex_hundres_of_thousands.csv', function (err, data) {
  if (err) { console.error(err); }
  render(data, '#chart');
});
