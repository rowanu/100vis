/*jslint browser: true, todo: true */
/*globals d3, _ */
var data;

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

var duration = 750,
  fullWidth = 1020,
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
    .rangePoints([height, 0], 2);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

// Size of points
var z = d3.scale.linear()
    .range([20, 1]);

var svg = d3.select('#container').append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// TODO: Change name by colour?
svg.append('g')
  .attr('class', 'y axis');

svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(10,' + height + ')');

function update(data, sortBy) {
  sortBy = sortBy || 'name';
  x.domain(d3.extent(data, function (d) { return d.rank; })).nice();
  y.domain(_.chain(data).sortBy(sortBy).pluck('name').reverse().value());
  z.domain(d3.extent(data, function (d) { return d.score; })).nice();
  
  svg.select('g.x.axis')
    .call(xAxis);
  svg.select('g.y.axis')
    .transition()
      .duration(duration)
      .call(yAxis);

  var dots = svg.selectAll('.dot')
      .data(data, function (d) { return d.name; });

  dots.enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', function (d) { return x(d.rank); })
    .attr('cy', function (d) { return y(d.name); })
    .attr('r', function (d) { return z(d.score); })
    .style('fill', function (d) { return colour(d.name); });

  dots.attr('class', 'dot')
    .transition()
      .duration(duration)
      .attr('cx', function (d) { return x(d.rank); })
      .attr('cy', function (d) { return y(d.name); });
}

d3.json('../data/2013-regionals-canada-east-women.json', function (err, response) {
  if (err) { console.error(err); }
  var atheletes = response.collection1;
  data = atheletes.map(function (a) {
    return {
      name: a.competitor.text.toLowerCase(),
      rank: +getRankScore(a.rankScore)[1],
      score: +getRankScore(a.rankScore)[2],
    };
  });

  update(data);
});

d3.selectAll('#sort input').on('change', function () {
  update(data, this.value);
});
