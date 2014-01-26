/*globals pjs, $ */
pjs.config({ 
  // options: 'stdout', 'file' (set in config.logFile) or 'none'
  log: 'stdout',
  // options: 'json' or 'csv'
  format: 'json',
  // options: 'stdout' or 'file' (set in config.outFile)
  writer: 'stdout',
  // writer: 'file',
  outFile: 'data/games.json'
});

pjs.addSuite({
    url: 'http://games.crossfit.com/scores/leaderboard.php?stage=5&sort=0&division=2&region=4&numberperpage=100&page=0&competition=0&frontpage=1&expanded=1&full=0&year=13&showtoggles=0&hidedropdowns=0&showathleteac=0&athletename=',
    scraper: function () {
      var athlete, athletes = [];

      $('.leaderboard-box tr[class!="lbhead"]').each(function () {
        athlete = {
          name: $(this).find('td.name').text()
        };
        // Check required fields are present
        if (athlete.name) {
          athletes.push(athlete);
        }
      });
      return athletes;
    },
    moreUrls: '#leaderboard-pager a',
    // moreUrls: function () {
    //   return _pjs.getAnchorUrls('#leaderboard-pager a');
    // },
    maxDepth: 1
});
