'use strict';

interface Config {
    distPath: string;
}

const config: Config = require('./config.json');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('watch-old', function () {
    return gulp.watch('./old-js-files/*.js', function () {
        return gulp.src('./old-js-files/*.js').pipe(gulp.dest(config.distPath));
    });
});

gulp.task('watch', function () {
    return gulp.watch('./src/**/*.ts', function () {
        let tsResult = tsProject.src() // or tsProject.src()
            .pipe(tsProject());

        // return tsResult.js.pipe(gulp.dest(config.distPath));
        return tsResult.js.pipe(gulp.dest('dist'));
    });
});
