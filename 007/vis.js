/*jslint browser: true */
/*globals d3, _ */

var height = 960,
  width = 500,
  radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal().range(['lightblue', 'lightpink']);
// var color = d3.scale.category10();

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 100);

var pie = d3.layout.pie()
  .sort(null)
  .value(function (d) { return d.count; });

var svg = d3.select('#chart')
  .append('svg')
    .attr('height', height)
    .attr('width', width)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

d3.json('../data/repos.json', function (err, repos) {
  if (err) { console.error(err); }

  var data = _.chain(repos).countBy('fork').pairs().map(function (d) {
    return {
      type: d[0] === 'true' ? 'forked' : 'not forked',
      count: d[1]
    };
  }).value();

  var path = svg.selectAll('path')
      .data(pie(data))
    .enter().append('path')
      .style('fill', function (d, i) { return color(i); })
      .attr('d', arc)

});
