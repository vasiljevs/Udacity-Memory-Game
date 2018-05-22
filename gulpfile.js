const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
});

// Styles
gulp.task('styles', () =>
  gulp
    .src('./css/app.css')
    .pipe(
      plumber(function(err) {
        console.log('Styles Task Error');
        console.log(err);
        this.emit('end');
      }),
    )
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie11' }))
    .pipe(cleanCSS({ level: '2' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      sourcemaps.write('./', {
        sourceMappingURL(file) {
          return `${file.relative}.map`;
        },
      }),
    )
    .pipe(gulp.dest('./css/')),
);

// JavaScript
gulp.task('minify-js', () =>
  gulp
    .src('./js/app.js')
    .pipe(
      plumber(function(err) {
        console.log('JavaScript Task Error');
        console.log(err);
        this.emit('end');
      }),
    )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['es2015'],
      }),
    )
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      sourcemaps.write('./', {
        sourceMappingURL(file) {
          return `${file.relative}.map`;
        },
      }),
    )
    .pipe(gulp.dest('./js/')),
);

// Build task
gulp.task('build', ['styles', 'minify-js'], () => {
  console.log('Building Project.');
});

// Watch task runner
gulp.task('watch', ['browser-sync', 'build'], () => {
  console.log('Starting watch task');
  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('css/app.css', ['styles']).on('change', browserSync.reload);
  gulp.watch('js/app.js', ['minify-js']).on('change', browserSync.reload);
});
