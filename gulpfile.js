var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('jshint:tests', function () {
  return gulp.src(['test/**/*.test.js'])
    .pipe(jshint('./test/.jshintrc'))
    .pipe(jshint.reporter('default'));
});
 
gulp.task('jshint:code', function () {
  return gulp.src(['gulpfile.js', './lib/**/*.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('mochaTest', ['jshint:tests', 'jshint:code'], function () {
  return gulp.src('test/**/*.test.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('default', ['jshint:tests', 'jshint:code', 'mochaTest']);