var gulp = require('gulp'),
    path = require('path'),
    ts = require('gulp-typescript'),
    less =require('gulp-less'),
    sequence = require('run-sequence'),
    connect = require('gulp-connect'),
    merge = require('merge2'),
    run = require('gulp-run');

// javascripts
gulp.task('typescript', function(){
    var tsResult = gulp.src(['typing/*.d.ts', 'src/*.ts'])
                        .pipe(ts({
                            noExternalResolve: true,
                            removeComments: true,
                            out: 'event-calendar.js'
                        }));

    return tsResult.js.pipe(gulp.dest('dist/app'));
});

// include definition file
gulp.task('tsdef', function(){
    var tsResult = gulp.src(['typing/*.d.ts', 'src/*.ts'])
                        .pipe(ts({
                            declarationFiles: true,
                            removeComments: true,
                            noExternalResolve: true,
                            out: 'event-calendar.js'
                        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('def')),
        tsResult.js.pipe(gulp.dest('dist/app'))
    ]);
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
    return gulp.src('src/less/calendar.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'node_modules') ]
        }))
        .pipe(gulp.dest('dist/app'));
});

gulp.task('css', function(){
    return gulp.src([
                    'node_modules/bootstrap/dist/css/bootstrap.min.css'
                ])
                .pipe(gulp.dest('dist/css'));
});

// server
gulp.task('connect', function () {
    connect.server({
        port: 8010,
        livereload: true,
        hostname: "*",
        base: "dist/"
    });
});

// watch
gulp.task('watch', function(){
    gulp.watch('src/*.ts', ['typescript']);
    gulp.watch('src/less/calendar.less', ['less']);
});

gulp.task('dev', ['js', 'css', 'typescript', 'less', 'connect', 'watch']);
gulp.task('default', function(){
    sequence('js', 'css', 'typescript', 'less');
});

// yuidoc
gulp.task('doc', function(){
    run('yuidoc -c yuidoc.json').exec();
});


