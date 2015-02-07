'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: '.',
    dist: './dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      // bower: {
      //   files: ['bower.json'],
      //   tasks: ['wiredep']
      // },
      // js: {
      //   files: ['<%= config.app %>/public/scripts/{,*/}*.js'],
      //   tasks: ['jshint'],
      //   options: {
      //     livereload: true
      //   }
      // },
      // jstest: {
      //   files: ['test/spec/{,*/}*.js'],
      //   tasks: ['test:watch']
      // },
      // gruntfile: {
      //   files: ['Gruntfile.js']
      // },
      sass: {
        files: ['<%= config.app %>/public/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/public/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    }
  });
}