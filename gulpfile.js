var gulp = require('gulp'),
    path = require('path'),
    ts = require('gulp-typescript'),
    less =require('gulp-less'),
    sequence = require('run-sequence');

// javascripts
gulp.task('typescript', function(){
    var tsResult = gulp.src(['typing/*.d.ts', 'src/*.ts'])
                        .pipe(ts({
                            noExternalResolve: true,
                            out: 'event-calendar.js'
                        }));

    return tsResult.js.pipe(gulp.dest('assets/app'));
});

gulp.task('js', function(){
    return gulp.src([
                    'node_modules/jquery/dist/jquery.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/moment/min/moment-with-locales.min.js'
                ])
                .pipe(gulp.dest('assets/js'));
});

// css
gulp.task('less', function(){
    return gulp.src('src/less/calendar.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'node_modules') ]
        }))
        .pipe(gulp.dest('assets/app'));
});

gulp.task('css', function(){
    return gulp.src([
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/font-awesome/css/font-awesome.min.css'
                ])
                .pipe(gulp.dest('assets/css'));
});

// fonts
gulp.task('fonts', function(){
    return gulp.src([
                    'node_modules/font-awesome/fonts/*',
                    'node_modules/bootstrap/fonts/*'
                ])
               .pipe(gulp.dest('assets/fonts'));
});

gulp.task('default', function(){
    sequence('fonts', 'js', 'css', 'typescript', 'less');
});



