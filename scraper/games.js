/*globals pjs, $ */
pjs.config({ 
  log: 'stdout',
  format: 'json',
  // writer: 'stdout',
  writer: 'file',
  outFile: 'data/2013-crossfit-open-women.json'
});

pjs.addSuite({
    url: 'http://games.crossfit.com/scores/leaderboard.php?' +
      'stage=5&' +
      'sort=0&' +
      'division=2&' +
      'region=4&' +
      'numberperpage=100&' +
      'page=0&' +
      'competition=0&' +
      'frontpage=1&' +
      'expanded=1&' +
      'full=0&' +
      'year=13&' +
      'showtoggles=0&' +
      'hidedropdowns=0&' +
      'showathleteac=0&' +
      'athletename=',
    scraper: function () {
      var athlete, athleteDOM, athletes = [];

      $('.leaderboard-box tr').each(function () {
        athleteDOM = $(this).find('td');
        athlete = {
          rankScore: $(athleteDOM[0]).text().trim(),
          name: $(athleteDOM[1]).text().trim(),
          event01: $(athleteDOM[2]).text().trim(),
          event02: $(athleteDOM[3]).text().trim(),
          event03: $(athleteDOM[4]).text().trim(),
          event04: $(athleteDOM[5]).text().trim(),
          event05: $(athleteDOM[6]).text().trim(),
        };
        // Check required fields are present
        if (athlete.name) {
          athletes.push(athlete);
        }
      });
      return athletes;
    },
    moreUrls: '#leaderboard-pager a',
    maxDepth: 1
});
