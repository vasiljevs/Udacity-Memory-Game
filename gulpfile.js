const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// HTML
gulp.task('reload-html', () => {
  gulp.src('index.html').pipe(livereload());
});

// Styles
gulp.task('styles', () =>
  gulp
    .src('./css/app.css')
    .pipe(plumber(function (err) {
      console.log('Styles Task Error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(cleanCSS({ level: '2' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./', {
      sourceMappingURL(file) {
        return `${file.relative}.map`;
      },
    }))
    .pipe(gulp.dest('./css/'))
    .pipe(livereload()));

// JavaScript
gulp.task('minify-js', () =>
  gulp
    .src('./js/app.js')
    .pipe(plumber(function (err) {
      console.log('JavaScript Task Error');
      console.log(err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./', {
      sourceMappingURL(file) {
        return `${file.relative}.map`;
      },
    }))
    .pipe(gulp.dest('./js/'))
    .pipe(livereload()));

// Build task
gulp.task('build', ['styles', 'minify-js'], () => {
  console.log('Building CSS Styles.');
});

// Watch task runner
gulp.task('watch', ['build'], () => {
  console.log('Starting watch task');
  require('./server.js');
  livereload.listen();
  gulp.watch('index.html', ['reload-html']),
  gulp.watch('css/app.css', ['styles']),
  gulp.watch('js/app.js', ['minify-js']);
});