'use strict';

interface Config {
    distPath: string;
}

const config: Config = require('./config.json');
const gulp = require('gulp');

gulp.task('watch-old', function () {
    return gulp.watch('./old-js-files/*.js', function () {
        return gulp.src('./old-js-files/*.js').pipe(gulp.dest(config.distPath));
    });
});