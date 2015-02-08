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

    express: {
      dev: {
        options: {
          script: './bin/www'
        }
      }
    },

    watch: {
      styles: {
        files: '<%= config.dev.styles %>*.scss',
        tasks: ['compile', 'prefix', 'minify'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: '<%= config.dev.scripts %>*.js',
        tasks: ['lint', 'scripts', 'express:dev']
      }
    },

    sass: {
      main: {
        files: {
          '<%= config.build.styles %>style.css': '<%= config.dev.styles %>style.scss'
        }
      }
    },

    autoprefixer: {
      main: {
        src: '<%= config.build.styles %>style.css'
      }
    },

    cssmin: {
      options: {
        report: 'gzip'
      },
      main: {
        files: {
          '<%= config.dist.styles %>style.css': '<%= config.build.styles %>style.css'
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        mangle: false
      },
      all: {
        files: {
          '<%= config.dist.scripts %>main.min.js': '<%= config.dev.scripts %>*.js'
        }
      }
    },

    jshint: {
      options: '<%= config.jshint %>',
      all: ['<%= config.dev.scripts %>**/*.js']
    }

  });

  grunt.registerTask('dev', ['express:dev', 'watch']);
  grunt.registerTask('compile', ['sass']);
  grunt.registerTask('prefix', ['autoprefixer']);
  grunt.registerTask('minify', ['cssmin']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('scripts', ['uglify']);
  grunt.registerTask('build', ['compile', 'prefix', 'minify']);

};