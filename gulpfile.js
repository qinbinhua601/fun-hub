const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const sass = require('gulp-ruby-sass');
const plumber = require('gulp-plumber');

gulp.task('sass', function() {
    return sass('src/sass/**/*.sass')
        .on('error', sass.logError)
        .pipe(gulp.dest('public/css'))
})

gulp.task('babel', () => {
	return gulp.src(['src/js/*.js', 'src/config/*.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env', 'es2015', 'stage-2']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/js'))
})

gulp.task('watch', function() {
  gulp.watch('src/js/*.js', ['babel']);
  gulp.watch('src/sass/**/*.sass', ['sass']);
})

gulp.task('default', () =>
	gulp.start('babel', 'sass', 'watch')
)
