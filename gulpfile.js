var gulp = require('gulp'),
	jade = require('gulp-jade'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	less = require('gulp-less'),
	watch = require('gulp-watch'),
	prefix = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minify = require('gulp-minify-css'),
	sources = {
		jade: 'src/jade/**/*.jade',
		docs: "src/jade/*.jade",
		javascript: 'src/javascript/**/*.js',
		less: "src/less/**/*.less",
		overwatch: "./out/**/*.*",
		distribute: [
			'out/js/**/octo*.js',
			'out/css/**/octo*.css'
		]
	},
	destinations = {
		js: "out/js/",
		docs: "out/",
		css: "out/css/",
		distribute: 'dist/'
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
gulp.task('js:publish', function(event) {
	return gulp.src(sources.javascript)
		.pipe(gulp.dest(destinations.js))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(destinations.js));
});
gulp.task('js:watch', function(event) {
	gulp.watch(sources.javascript, ['js:publish']);
});
/*LESS TASK*/
gulp.task('less:compile', function(event) {
	return gulp.src(sources.less)
		.pipe(plumber())
		.pipe(less())
		.pipe(prefix([
			'last 3 versions',
			'Blackberry 10',
			'Android 3',
			'Android 4'
		]))
		.pipe(gulp.dest(destinations.css))
		.pipe(minify())
		.pipe(rename({
			suffix: '.min'
		}))
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
gulp.task('build:complete', ['jade:compile', 'js:publish', 'less:compile']);
gulp.task('distribute', ['build:complete'], function(event) {
	return gulp.src(sources.distribute)
		.pipe(gulp.dest(destinations.distribute));
});
/*DEFAULT TASK*/
gulp.task('default', [
	'serve',
	'jade:watch',
	'less:watch',
	'js:watch'
]);
