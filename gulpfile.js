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
  js: {
    watch: './dev/scripts/**/*.js',
    src: ['./dev/scripts/jquery.fittext.js', './dev/scripts/main.js', './dev/scripts/ga.js'],
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

gulp.task('js', function() {
  gulp.src('./dev/scripts/play-game-of-life.js').pipe(gulp.dest(paths.js.build));
  gulp.src(paths.js.src)
    .pipe(concat('main.min.js'))
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

gulp.task('default', ['css', 'dev']);
