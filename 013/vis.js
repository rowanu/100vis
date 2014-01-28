/*jslint browser: true, todo: true */
/*globals d3, topojson */
var width = 960,
  height = 500;

var colour = d3.scale.category20();

var projection = d3.geo.mercator()
  .rotate([-180, 0]);
  
var svg = d3.select('#container').append('svg')
  .attr('width', width)
  .attr('height', height);

var path = d3.geo.path()
  .projection(projection);

var g = svg.append('g');

d3.json('world-110m2.json', function (err, topology) {
  if (err) { console.error(err); }
  var countries = topojson.feature(topology, topology.objects.countries).features,
    neighbours = topojson.neighbors(topology.objects.countries.geometries);
  g.selectAll('path')
    .data(countries)
  .enter()
    .append('path')
    .attr('d', path)
    // This assigns a colour to a country, or sets it if it doesn't have one
    .style('fill', function (d, i) { return colour(d.colour = d3.max(neighbours[i], function (n) { return countries[n].colour; }) + 1 | 0); });
});
