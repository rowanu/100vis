/*jslint browser: true */
/*globals d3 */

var parseDate =  d3.time.format('%Y/%m/%d').parse;

function render(data, selector) {
  // Cast
  data.forEach(function (d) {
    d.Period = parseDate(d.Period);
    d.Males = +d.Males;
    d.Females = +d.Females;
    d.Persons = +d.Persons;
  });

  // Settings
  var margin = {top: 20, right: 20, bottom: 50, left: 50},
    padding = 1,
    fullWidth = 1020, fullHeight = 500,
    width = fullWidth - margin.left - margin.right,
    height = fullHeight - margin.top - margin.bottom,
    barWidth = (width / data.length) - (2 * padding);

  var x = d3.time.scale()
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.time.format("%b'%y"))
    .orient('bottom');

  var y = d3.scale.linear()
    .range([height, 0]);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

  var z = d3.scale.ordinal().range(['royalblue', 'violet']);

  var sexes = d3.layout.stack()(['Males', 'Females'].map(function (sex) {
    return data.map(function (d) {
      return {x: d.Period, y: d[sex]};
    });
  }));

  y.domain([0, d3.max(sexes[sexes.length -1], function (d) { return d.y0 + d.y; })]);
  x.domain(d3.extent(sexes[0], function (d) { return d.x; })).nice(d3.time.month, 4);

  var svg = d3.select(selector)
    .append('svg')
      .attr('width', fullWidth)
      .attr('heigh', fullHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var sex = svg.selectAll('g.sex')
      .data(sexes)
    .enter().append('svg:g')
      .attr('class', 'sex')
      .style('fill', function (d, i) { return z(i); })
      .style('stroke', function (d, i) { return d3.rgb(z(i)).darker(); });

  var rect = sex.selectAll('rect')
      .data(Object)
    .enter().append('svg:rect')
      .attr('x', function (d) { return x(d.x); })
      .attr('y', function (d) { return y(d.y0 + d.y); })
      .attr('height', function (d) { return height - y(d.y); })
      .attr('width', barWidth);


  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);
}

d3.csv('data/australian_unemployed_by_sex_hundres_of_thousands.csv', function (err, data) {
  if (err) { console.error(err); }
  render(data, '#chart');
});
