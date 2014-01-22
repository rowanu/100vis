/*jslint browser: true */
/*globals d3, _ */

var width = 960,
  height = 500,
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

d3.json('https://api.github.com/users/rowanu/repos', function (err, repos) {
  if (err) { console.error(err); }

  var data = _.chain(repos).countBy('fork').pairs().map(function (d) {
    return {
      type: d[0] === 'true' ? 'forked' : 'not-forked',
      count: d[1]
    };
  }).value();

  var g = svg.selectAll('.arc')
      .data(pie(data))
    .enter().append('g')
      .attr('class', 'arc');

  g.append('path')
    .style('fill', function (d, i) { return color(i); })
    .attr('d', arc);

  g.append('text')
    .attr('transform', function (d) { return 'translate(' + arc.centroid(d) + ')'; })
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .text(function (d) { return d.data.type; });
});
