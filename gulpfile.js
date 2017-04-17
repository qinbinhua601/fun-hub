const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sass = require('gulp-ruby-sass');

gulp.task('sass', function() {
    return sass('src/sass/**/*.sass')
        .on('error', sass.logError)
        .pipe(gulp.dest('public/css'))
})

gulp.task('babel', () => {
	return gulp.src('src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env', 'es2015', 'stage-2']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/js'))
})

gulp.task('watch', function() {
  gulp.watch(['babel', 'sass']);
})

gulp.task('default', () =>
	gulp.start('babel', 'sass', 'watch')
)
