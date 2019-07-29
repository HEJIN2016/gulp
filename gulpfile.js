var gulp = require('gulp');
var less = require('gulp-less');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync');
var cache = require('gulp-cached');
var del = require('del');
var cssnano = require('gulp-cssnano');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');
const connect = require('gulp-connect');

gulp.task('task-name', function(){
	console.log("hello-world");
});

gulp.task('less', function(){
	return gulp.src('app/less/all.less')
		.pipe(less())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('images', function(){
  	return gulp.src('app/images/**/*.+(png|jpg|gif|jpeg|svg)')
  	.pipe(cache(imagemin({
      optimizationLevel: 3, progressive: true, interlaced: true
      // interlaced: true
    })))
  	.pipe(gulp.dest('dist/images'))

  // return gulp.src('app/images/*')
  //   .pipe(cache('image'))
  //   .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
  //   .pipe(gulp.dest('dist/images'))
  //   .pipe(connect.reload())
});

// Copying fonts
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// Cleaning
gulp.task('clean', function() {
    return del.sync('dist').then(function(cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

gulp.task('watch-less',function(){
	gulp.watch('app/less/**/*.less',['less'])
})

// Optimizing CSS and JavaScript
gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', babel()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

// Start browserSync server
gulp.task('browser',function(){
	browserSync({
		server: {
			baseDir: 'app'
		}
	})
})

gulp.task('build',function(callback){
	runSequence(
        'clean:dist',
        'less',
        ['images', 'fonts', 'useref'],
        callback
    )
})

gulp.task('watch',function(){
	gulp.watch('app/less/**/*.less',['less']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js**/*.js',browserSync.reload);
})

gulp.task('default', function(callback) {
    runSequence(['less', 'browser'], 'watch',
        callback
    )
});