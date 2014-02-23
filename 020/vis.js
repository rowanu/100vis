/*jslint browser: true */
/*globals d3, moment */
// Based off http://bl.ocks.org/mbostock/1098617
var width = 500,
  height = 500,
  radius = Math.min(width, height) / 2,
  endMoment = moment().add('seconds', 10),
  endAngle;

var arc = d3.svg.arc()
  .outerRadius(radius - 20)
  .innerRadius(radius - 80)
  .startAngle(0);

var svg = d3.select('#container').append('svg')
    .attr('height', height)
    .attr('width', width)
  .append('g')
    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

var text = svg.append('text');

var path = svg.append('path')
    .datum({endAngle: 2 * Math.PI})
    .style('fill', 'cadetblue')
    .attr('d', arc);

function arcTween(b) {
  var i = d3.interpolate({endAngle: b.previous}, b);
  return function(t) {
    return arc(i(t));
  };
}

function updateAngle() {
  if (moment() > endMoment) { endMoment = moment().add('seconds', 10); }
  var previous = endAngle || 2 * Math.PI;
  endAngle = d3.min([((endMoment - moment()) / 10000) * 2 * Math.PI, 2 * Math.PI]);
  path.datum({endAngle: endAngle, previous: previous}).transition()
      .ease('cubic')
      .duration(500)
      .attrTween('d', arcTween);
  text.text(endMoment);
}

updateAngle();
setInterval(updateAngle, 1000);
