var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    mocha = require('gulp-mocha');

gulp.task('jshint:test', function () {
  return gulp.src(['test/**/*.test.js'])
    .pipe(jshint('./test/.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});

gulp.task('jshint:integrationtest', function () {
  return gulp.src(['integration.test/**/*.test.js'])
    .pipe(jshint('./integration.test/.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});
 
gulp.task('jshint:code', function () {
  return gulp.src(['gulpfile.js', './lib/**/*.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});
 
gulp.task('jshint:examples', function () {
  return gulp.src(['./examples/*.js'])
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});

gulp.task('mochaTest', ['jshint:test', 'jshint:integrationtest', 'jshint:code', 'jshint:examples'], function () {
  return gulp.src('test/**/*.test.js', {read: false})
    .pipe(mocha({reporter: 'dot'}));
});

gulp.task('default', ['jshint:test', 'jshint:code', 'mochaTest']);