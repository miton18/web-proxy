const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

// default
gulp.task('default', ['watch']);

// watch
gulp.task('watch', function() {
  gulp.watch([
    'tests/**/*.js',
    'src/**/*.js'
  ], ['test']);
});

// test
gulp.task('tests', ['tests:mocha', 'tests:lint']);

// test:mocha
gulp.task('tests:mocha', function() {
  return gulp
    .src(['tests/**/*.js'], {read: false})
    .pipe(plugins.mocha());
});

// test:lint
gulp.task('tests:lint', function() {
  return gulp
    .src(['src/**/*.js', 'tests/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failOnError());
});
