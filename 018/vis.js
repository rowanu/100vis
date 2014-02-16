/*jslint browser: true */
/*globals d3 */
var width = 1020, height = 320,
  force = d3.layout.force()
    .size([width, height])
    .charge(-30)
    .gravity(0.2)
    .friction(0.9);

var svg = d3.select('#container')
    .append('svg')
      .attr('width', width)
      .attr('height', height);

force.on('tick', function () {
  svg.selectAll('circle')
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });
});

svg.on('click', function () {
  var point = d3.mouse(this),
    node = {x: point[0], y: point[1]};

  svg.append('circle')
      .data([node])
    .attr('class', 'node')
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; })
    .attr('r', 5);

  force.nodes().push(node);
  force.start();
});
