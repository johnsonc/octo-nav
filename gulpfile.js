var gulp = require('gulp'),
	jade = require('gulp-jade'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	less = require('gulp-less'),
	watch = require('gulp-watch'),
	prefix = require('gulp-autoprefixer'),
	sources = {
		jade: 'src/jade/**/*.jade',
		docs: "src/jade/*.jade",
		less: "src/less/**/*.less",
		style: "src/less/style.less",
		overwatch: "./out/**/*.*"
	},
	destinations = {
		js: "out/js/",
		docs: "out/",
		css: "out/css/"
	};
/*SERVER TASK*/
gulp.task('reload', function(event) {
	console.info('reloading');
	return gulp.src(sources.overwatch)
		.pipe(connect.reload());
});
gulp.task('serve', function(event) {
	connect.server({
		root: destinations.docs,
		port: 1987,
		livereload: true
	});
	// sets up a livereload that watches for any changes in the root
	gulp.watch(sources.overwatch, ['reload']);
});
/*LESS TASK*/
gulp.task('less:compile', function(event) {
	return gulp.src(sources.style)
		.pipe(plumber())
		.pipe(less())
		.pipe(prefix([
			'last 3 versions',
			'Blackberry 10',
			'Android 3',
			'Android 4'
		]))
		.pipe(gulp.dest(destinations.css));
});
/*LESS WATCH TASK FOR DEVELOPMENT*/
gulp.task('less:watch', function(event) {
	gulp.watch(sources.less, ['less:compile']);
});
/*JADE TASK*/
gulp.task('jade:compile', function(event) {
	return gulp.src(sources.docs)
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest(destinations.docs));
});
/*JADE WATCH TASK FOR DEVELOPMENT*/
gulp.task('jade:watch', function(event){
	gulp.watch(sources.jade, ['jade:compile']);
});
/*DEFAULT TASK*/
gulp.task('default', ["serve", "jade:watch", "less:watch"]);
