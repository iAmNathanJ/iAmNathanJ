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
    src: ['./dev/images/**/*.gif', './dev/images/**/*.jpg', './dev/images/**/*.jpeg', './dev/images/**/*.png', './dev/images/**/*.svg'],
    build: './public/images'
  }
};

gulp.task('css', function() {
  gulp.src(paths.css.src)
    .pipe(sourcemaps.init())

    .pipe(stylus({
      compress: false
    }))
    
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css.build))
    .pipe(livereload());
});

gulp.task('js', function() {
  gulp.src(paths.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.build))
    .pipe(livereload());
});

gulp.task('dev', function() {
  livereload.listen({
    
  });
  gulp.watch(paths.css.watch, ['css']);
  gulp.watch(paths.js.watch, ['js']);
});

gulp.task('default', ['dev']);