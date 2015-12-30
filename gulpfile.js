var gulp = require('gulp'),
    merge = require('merge-stream'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    ngannotate = require('gulp-ng-annotate'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del');

gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('usemin', 'imagemin', 'copyfonts', 'copyviews');
});

gulp.task('usemin',['jshint'], function () {
  return gulp.src('./app/**/*.html')
      .pipe(usemin({
        css:[minifycss(),rev()],
        js: [ngannotate(),uglify(),rev()]
      }))
      .pipe(gulp.dest('dist/'));
});

// Images
gulp.task('imagemin', function() {
  return del(['./dist/images']), gulp.src('./app/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./dist/images'))
    //.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('copyfonts', ['clean'], function() {
    var fontawesome = gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
    var boot =  gulp.src('./bower_components/bootstrap/fonts/**/*.{ttf,woff,woff2,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
    return merge(fontawesome, boot);
});

// Copyviews task
gulp.task('copyviews', ['jshint'], function() {
    return gulp.src('./app/views/**/*')
    .pipe(gulp.dest('./dist/views'));
});

// Watch
gulp.task('watch', ['browser-sync'], function() {
  // Watch .js files
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html,app/views/**/*.html}', ['usemin']);
      // Watch image files
  gulp.watch('./app/images/**/*', ['imagemin']);

});

gulp.task('browser-sync', ['default'], function () {
   var files = [
      'app/index.html',
      'app/styles/**/*.css',
      'app/images/**/*.png',
      'app/scripts/**/*.js',
      'app/views/**/*.html',
      'dist/**/*'
   ];

   browserSync.init(files, {
       server: {
         baseDir: "./dist",
         index: "index.html"
       },
       reloadDelay: 1000
   });

   gulp.task('default', ['browser-sync'], browserSync.reload);
        // Watch any files in dist/, reload on change
   gulp.watch(['./dist/**']).on('change', browserSync.reload);

});
