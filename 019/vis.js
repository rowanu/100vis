/*jslint browser: true */
/*globals d3, moment */
// Based off http://bl.ocks.org/mbostock/1098617
var width = 500,
  height = 500,
  radius = Math.min(width, height) / 2,
  endMoment = moment().add('minutes', 1);

var arc = d3.svg.arc()
  .outerRadius(radius - 20)
  .innerRadius(radius - 80)
  .startAngle(0);

var svg = d3.select('#container').append('svg')
    .attr('height', height)
    .attr('width', width)
  .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

var text = svg.append('text')
    // .attr('transform', 'translate(' + 0 - + ',0)');

var path = svg.append('path')
    .datum({endAngle: 2 * Math.PI}) // All of it
    .style('fill', 'cadetblue')
    .attr('d', arc);

function arcTween(b) {
  var i = d3.interpolate(b, b);
  return function(t) {
    return arc(i(t));
  };
}

setInterval(function () {
  var endAngle = d3.max([((endMoment - moment()) / 60000) * 2 * Math.PI, 0]);
  text.text(endMoment);
  path.datum({endAngle: endAngle}).transition()
      .duration(1000)
      .attrTween('d', arcTween);
}, 1000);
