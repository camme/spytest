var gulp = require('gulp');
var stylus = require('gulp-stylus');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var prefixer = require('gulp-autoprefixer');
var fs = require('fs');
var path = require('path');

// This task makes sure all css files are pre and postprosseced
gulp.task('css', function() {
    gulp.src(['./public/css/*.styl'])
        .pipe(stylus())
        .pipe(prefixer())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('views', function() {
    gulp.src(['views/*.dot']);
});


gulp.task('watch', function() {

    livereload.listen();

    gulp.watch('public/css/**/*.styl', ['css']).on('change', livereload.changed);
    gulp.watch('views/*.dot', ['views']).on('change', livereload.changed);

    gulp.start('start');
    gulp.start('css');

});

gulp.task('start-spygame', function() {

    var service = require('./');
    service.start(function() {
        gutil.log("Started Spygame");
    });

});

gulp.task('start', function() {

    gulp.start('start-spygame');

});


