'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    
    // Project Settings
    config: grunt.file.readJSON('grunt-config.json'),


    sass: {
      dist: {
        options: {
        },
        files: {
          '<%= config.dist.styles %>style.css': '<%= config.dev.styles %>style.scss'
        }
      }
    }

  });

  grunt.registerTask('style', ['sass']);

};