/*jslint browser: true, todo: true */
/*globals d3, _ */
var data;

function getRankScore(cell) {
  // console.log(cell);
  var rank, score, type = "normal";
  var re = new RegExp(/(\d*)T? \((\w*|\d{2}:\d{2}|\d*\.\d{2})\)/);

  // Ignore all this for DNF's
  if (cell.indexOf('DNF') > -1) {
    return {
      rank: Infinity,
      score: 0,
      scoreType: 'DNF'
    };
  }

  var matches = re.exec(cell);
  rank = matches[1];
  score = matches[2];
  // Check for time result
  if (score.indexOf(':') > -1) {
    var time = score.split(':'),
      minutes = +time[0],
      seconds = +time[1];
    score = minutes * 60 + seconds;
    type = "seconds";
  }
  return {
    rank: +rank,
    score: +score,
    scoreType: type
  };
}

var duration = 750,
  fullWidth = 1020,
  fullHeight = 750,
  margin = {top: 30, right: 20, bottom: 20, left: 300},
  width = fullWidth - margin.right - margin.left,
  height = fullHeight - margin.top - margin.bottom;

var colour = d3.scale.category20();

var x = d3.scale.linear()
    .clamp(true)
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('top');

var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var svg = d3.select('#container').append('svg')
    .attr('width', fullWidth)
    .attr('height', fullHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('g')
  .attr('class', 'y axis');

svg.append('g')
  .attr('class', 'x axis');

function update(data, show) {
  show = show || 'overall';
  x.domain(d3.extent(data, function (d) { return d[show].score; })).nice();
  y.domain(_.chain(data).sortBy(function (d) { return d[show].rank; }).pluck('name').reverse().value());
  
  svg.select('g.x.axis')
    .transition()
      .duration(duration)
      .call(xAxis);
  svg.select('g.y.axis')
    .transition()
      .duration(duration)
      .call(yAxis);


  var bars = svg.selectAll('rect.bar')
      .data(data);

  bars.enter().append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', function (d) { return y(d.name); })
    .attr('width', function (d) { return x(d[show].score); })
    .attr('height', y.rangeBand());

  bars.attr('class', 'bar')
    .transition()
      .duration(duration)
      .attr('y', function (d) { return y(d.name); })
      .attr('width', function (d) { console.log('ohai ' + show); return x(d[show].score); })
      ;
}

d3.json('../data/2013-regionals-canada-east-women.json', function (err, response) {
  if (err) { console.error(err); }
  var atheletes = response.collection1;
  data = atheletes.map(function (a) {
    return {
      name: a.competitor.text.toLowerCase(),
      overall: getRankScore(a.rankScore),
      // Scores
      event01: getRankScore(a.event01),
      event02: getRankScore(a.event02),
      event03: getRankScore(a.event03),
      event04: getRankScore(a.event04),
      event05: getRankScore(a.event05),
      event06: getRankScore(a.event06),
      event07: getRankScore(a.event07),
    };
  });
  // console.log(data);
  update(data);
});

d3.selectAll('#show input').on('change', function () {
  update(data, this.value);
});
