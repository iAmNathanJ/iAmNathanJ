var gulp          = require('gulp')
  , sourcemaps    = require('gulp-sourcemaps')
  , rename        = require('gulp-rename')
  , stylus        = require('gulp-stylus')
  , autoprefixer  = require('gulp-autoprefixer')
  , uglify        = require('gulp-uglify')
  , concat        = require('gulp-concat')
  , livereload    = require('gulp-livereload');

var paths = {
  css: {
    watch: './dev/styles/**/*.styl',
    src: './dev/styles/style.styl',
    build: './public/styles'
  },
  img: {
    src: ['./dev/images/**/*.gif', './dev/images/**/*.jpg', './dev/images/**/*.jpeg', './dev/images/**/*.png', './dev/images/**/*.svg'],
    build: './public/images'
  }
};

gulp.task('css', function() {
  gulp.src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.build))
    .pipe(livereload());
});

gulp.task('dev', function() {
  gulp.watch(paths.css.watch, ['css']);
});

gulp.task('default', ['css', 'dev']);
