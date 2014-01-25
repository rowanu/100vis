/*jslint browser: true, todo: true */
/*globals d3, _ */
// TODO: Handle 'DNF' scores
function getRankScore(cell) {
  // console.log(cell);
  var matches;
  // var re = new RegEx(/(\d) \((\d*\.\d*|\d*:\d*)\)/);
  // var timeResult = new RegExp(/(\d) \((\d*:\d*)\)/);
  var overall = new RegExp(/(\d*) \((\w*|)\)/);
  matches = overall.exec(cell);
  return matches;
}

var fullWidth = 1020,
  fullHeight = 750,
  margin = {top: 20, right: 20, bottom: 30, left: 300},
  width = fullWidth - margin.right - margin.left,
  height = fullHeight - margin.top - margin.bottom;

var colour = d3.scale.category20();

var x = d3.scale.linear()
    .clamp(true)
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var y = d3.scale.ordinal()
    .rangePoints([height, 0], 1);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var svg = d3.select('#container').append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json('../data/2013-regionals-canada-east-women.json', function (err, response) {
  if (err) { console.error(err); }
  var atheletes = response.collection1;
  var data = atheletes.map(function (a) {
    return {
      name: a.competitor.text.toLowerCase(),
      rank: +getRankScore(a.rankScore)[1],
      score: +getRankScore(a.rankScore)[2],
    };
  });

  y.domain(_.chain(data).pluck('name').sort().reverse().value());
  x.domain(d3.extent(data, function (d) { return d.rank; })).nice();
  
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  svg.selectAll('.dot')
      .data(data)
    .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', function (d) { return x(d.rank); })
      .attr('cy', function (d) { return y(d.name); })
      .style('fill', function (d) { return colour(d.name); });

});
