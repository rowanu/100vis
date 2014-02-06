/*jslint browser: true */
/*globals d3, _ */

var width = 960,
  height = 500,
  delay = 2000,
  radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal().range(['lightblue', 'lightpink']);

var arc = d3.svg.arc()
    .outerRadius(radius - 20)
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
// d3.json('https://api.github.com/users/rowanu/repos', function (err, repos) {
  if (err) { console.error(err); }

  var data = _.chain(repos).countBy('fork').pairs().map(function (d) {
    return {
      type: d[0] === 'true' ? 'forked' : 'not-forked',
      count: d[1]
    };
  }).value();

  var slices = svg.selectAll('path.arc')
      .data(pie(data));

  slices.enter()
      .append('path')
      .attr('class', 'arc')
      .style('fill', function (d, i) { return color(i); });

  slices.transition()
    .duration(delay)
    .attrTween('d', function (d) {
      var currentArc = this.__current__;
      if (!currentArc) {
        currentArc = {startAngle: 0, endAngle: 0};
      }
      var interpolate = d3.interpolate(currentArc, d);
      this.__current__ = interpolate(1);
      return function (t) {
        return arc(interpolate(t));
      };
    });

  var labels = svg.selectAll('text.label')
      .data(pie(data));
  
  labels.enter()
    .append('text')
    .attr('class', 'label');

  labels.transition()
    .delay(delay)
    .attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')'; })
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .text(function (d) { return d.data.type; });
});
