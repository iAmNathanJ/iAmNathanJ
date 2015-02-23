var gulp = require('gulp')
  , sourcemaps = require('gulp-sourcemaps')
  , stylus = require('gulp-stylus')
  , autoprefixer = require('gulp-autoprefixer')
  , uglify = require('gulp-uglify')
  , livereload = require('gulp-livereload');


var paths = {
  css: {
    watch: './dev/styles/**/*.styl',
    src: './dev/styles/style.styl',
    build: './public/styles'
  },
  js: {
    watch: './dev/scripts/**/*.js',
    src: './dev/scripts/**/*.js',
    build: './public/scripts'
  },
  img: {
    src: './dev/images/**/*.*',
    build: './public/images'
  }
};

gulp.task('css', function(){
  gulp.src(paths.css.src)
    .pipe( sourcemaps.init() )

    .pipe( stylus({
      compress: true 
    }))
    
    .pipe( autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest(paths.css.build) );
});


gulp.task('dev', function(){
  gulp.watch(paths.css, ['css']);
});

gulp.task('default', ['dev']);