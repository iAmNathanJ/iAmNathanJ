'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project Settings
    config: grunt.file.readJSON('grunt-config.json'),

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
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        options: {
          sourcemap: true
        },
        dist: {
          files: {
            '<%= config.dev.styles %>main.scss': '<%= config.dist.styles %>style.css'
          }
        }
      }
      // livereload: {
      //   options: {
      //     livereload: '<%= connect.options.livereload %>'
      //   },
      //   files: [
      //     '<%= config.build.styles{,*/}*.css',
      //     '<%= config.dev.images %>{,*/}*'
      //   ]
      // }
    }
  });
  grunt.resgisterTask('build', ['watch']);
}