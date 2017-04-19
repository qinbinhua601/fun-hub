var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var sass = require('gulp-ruby-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

browserSync.init({
  proxy: 'localhost:5000'
});

gulp.task('sass', () => {
  return sass('src/sass/**/*.sass')
    .on('error', sass.logError)
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream())
});

gulp.task('babel', () => {
  return gulp.src(['src/js/*.js', 'src/config/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env', 'es2015', 'stage-2']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream())
})

gulp.task('watch', function () {
  gulp.watch('src/js/*.js', ['babel']);
  gulp.watch('src/sass/**/*.sass', ['sass']);
})

gulp.task('default', ['babel', 'sass', 'watch'])
