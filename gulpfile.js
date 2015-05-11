var gulp = require('gulp'),
    path = require('path'),
    ts = require('gulp-typescript'),
    less =require('gulp-less'),
    sequence = require('run-sequence'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload');

// javascripts
gulp.task('typescript', function(){
    var tsResult = gulp.src(['typing/*.d.ts', 'app/*.ts'])
                        .pipe(ts({
                            noExternalResolve: true,
                            out: 'event-calendar.js'
                        }));

    return tsResult.js.pipe(gulp.dest('dist/app')).pipe(livereload());
});

gulp.task('js', function(){
    return gulp.src([
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/moment/min/moment-with-locales.min.js'
                ])
                .pipe(gulp.dest('dist/js'));
});

// css
gulp.task('less', function(){
    return gulp.src('app/less/calendar.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'node_modules') ]
        }))
        .pipe(gulp.dest('dist/app')).pipe(livereload());
});

gulp.task('css', function(){
    return gulp.src([
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/font-awesome/css/font-awesome.min.css'
                ])
                .pipe(gulp.dest('dist/css'));
});

// fonts
gulp.task('fonts', function(){
    return gulp.src([
                    'node_modules/font-awesome/fonts/*',
                    'node_modules/bootstrap/fonts/*'
                ])
               .pipe(gulp.dest('dist/fonts'));
});

// server
gulp.task('connect', function () {
    connect.server({
        port: 8000,
        livereload: true,
        hostname: "*",
        base: "dist/"
    });
});

// watch
gulp.task('watch', function(){
    gulp.watch('app/*.ts', ['typescript']);
    gulp.watch('app/less/calendar.less', ['less']);
});

gulp.task('dev', ['fonts', 'js', 'css', 'typescript', 'less', 'connect', 'watch']);
gulp.task('default', function(){
    sequence('fonts', 'js', 'css', 'typescript', 'less');
});



