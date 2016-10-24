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
gulp.task('test', ['test:mocha', 'test:lint']);

// test:mocha
gulp.task('test:mocha', function() {
  return gulp.src(['tests/**/*.js'])
             .pipe(plugins.mocha());
});

// test:lint
gulp.task('test:lint', function() {
  return gulp.src(['src/**/*.js', 'tests/**/*.js'])
             .pipe(plugins.eslint())
             .pipe(plugins.eslint.format())
             .pipe(plugins.eslint.failAterError());
});
