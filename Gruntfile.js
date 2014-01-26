var pjscrape = '~/Code/github/pjscrape/pjscrape.js';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          keepalive: true
        }
      }
    },
    shell: {
      scrape: {
        options: {
          stdout: true
        },
        command: 'phantomjs ' + pjscrape + ' scraper/games.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect']);
};
