var gulp       = require('gulp'),
	sass         = require('gulp-sass'), 
	browserSync  = require('browser-sync'), 
	concat       = require('gulp-concat'),
	uglify       = require('gulp-uglifyjs'), 
	cssnano      = require('gulp-cssnano'), 
	rename       = require('gulp-rename'),
	del          = require('del'),
	imagemin     = require('gulp-imagemin'), 
	pngquant     = require('imagemin-pngquant'), 
	cache        = require('gulp-cache'), 
	pug          = require('gulp-pug'),  
	autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('app/sass/**/*.scss') 
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('app/css')) 
		.pipe(browserSync.reload({stream: true})) 
	});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ 
		server: { 
			baseDir: 'app' 
		},
		notify: false 
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		'app/libs/jquery/dist/jquery.min.js', 
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/slick/slick.min.js',
		'app/libs/wow/wow.min.js' 
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify()) 
		.pipe(gulp.dest('app/js')); 
});
gulp.task('pug', function() {
  return gulp.src('app/partials/index.pug')
  .pipe(pug({
  	pretty:true
  }))
  .pipe(gulp.dest("./app/"))
});
gulp.task('css-libs', ['sass'], function() {
	return gulp.src([
	    'app/css/libs.css',
	    'app/libs/slick/slick-theme.css',
	    'app/libs/slick/slick.css',
	    'app/libs/wow/animate.css'
	    ]) 
		.pipe(cssnano()) 
		.pipe(concat('libs.min.css'))
		.pipe(gulp.dest('app/css')); 
});

gulp.task('watch', ['browser-sync', 'pug','css-libs', 'scripts'], function() {
	gulp.watch('app/sass/**/*.scss', ['sass']); 
	gulp.watch('app/*.html', browserSync.reload); 
	gulp.watch('app/js/**/*.js', browserSync.reload);   
	gulp.watch('app/partials/**/*.pug', browserSync.reload);  
});

gulp.task('clean', function() {
	return del.sync('dist'); 
});

gulp.task('img', function() {
	return gulp.src('app/images/**/*') 
		.pipe(cache(imagemin({ 
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/images/'));
});

gulp.task('build', ['clean', 'img','sass', 'scripts'], function() {

	var buildCss = gulp.src([ 
		'app/css/reset.css',
		'app/css/fonts.css',
		'app/css/style.css',
		'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/webfonts/**/*')
	.pipe(gulp.dest('dist/webfonts'))

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') 
	.pipe(gulp.dest('dist'));

});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
