/*jslint browser: true */
/*globals d3 */
function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}

var margin = {top: 10, right: 10, bottom: 10, left: 10},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var color = d3.scale.linear()
  .domain([0, 14])
  .interpolate(d3.interpolateHcl)
  .range(['#69D2E7', '#FA6900']);

var treemap = d3.layout.treemap()
  .size([width, height])
  .sort(function (a, b) { return a.volume - b.volume; })
  .value(function (d) { return d.volume; });

var div = d3.select('#container').append('div')
    .style('position', 'absolute')
    .attr('class', 'treemap')
    .attr('width', width)
    .attr('height', height);

function convertVolumesToData(exchanges) {
  var exchange, volumes = {name: 'volumes'};
  delete exchanges.timestamp;
  volumes.children = [];
  for (exchange in exchanges) {
    if (exchanges.hasOwnProperty(exchange)) {
      volumes.children.push({
        name: exchange,
        volume: exchanges[exchange].volume_btc * 100
      });
    }
  }
  return volumes;
}

d3.json('https://api.bitcoinaverage.com/exchanges/USD', function (err, exchanges) {
  if (err) { console.error(err); }
  var volumes = convertVolumesToData(exchanges);

  div.datum(volumes).selectAll('.node')
      .data(treemap.nodes)
    .enter().append('div')
      .attr('class', 'node')
      .call(position)
      .style('background', function (d, i) { return color(i); })
      .text(function (d) { return d.name; });
});
