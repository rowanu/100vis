/*jslint browser: true, todo: true */
/*globals d3, topojson */
var width = 960,
  height = 500;

var projection = d3.geo.mercator()
  // TODO: Check
  // .center([0, 5])
  // .scale(900)
  .rotate([-180, 0]);
  
var svg = d3.select('#container').append('svg')
  .attr('width', width)
  .attr('height', height);

var path = d3.geo.path()
  .projection(projection);

var g = svg.append('g');

d3.json('world-110m2.json', function (err, topology) {
  if (err) { console.error(err); }
  g.selectAll('path')
    .data(topojson.feature(topology, topology.objects.countries).features)
  .enter()
    .append('path')
    .attr('d', path);
});

var zoom = d3.behavior.zoom()
.on('zoom', function () {
  console.log('zoom!');
  console.log(d3.event.translate);
  console.log(d3.event.scale);
  g.attr('transform', 'translate(' + d3.event.translate.join(',') +
         ') scale(' + d3.event.scale + ')');
  g.selectAll('path')
    .attr('d', path.projection(projection));
});

svg.call(zoom);
