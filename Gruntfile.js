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
      options: {
        sourceMap: true
      },
      dist: {
        file: {
          './public/styles/main.scss': './public/styles/NEWstyle.css'
        }
      }
    }

  });

  // Default task(s).
  grunt.registerTask('style', ['sass:dist']);

};