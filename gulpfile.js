"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const isProd = process.env.NODE_ENV === 'prod';
const htmlPartial = require('gulp-html-partial');
const htmlmin = require('gulp-htmlmin');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');


// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = ['/*!\n',
  ' * Petrodyn - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> \n',
  ' */\n',
  '\n'
].join('');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./aplication"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./aplication"]);
}

const htmlFile = [
  'src/*.html'
]

function html() {
  return gulp.src(htmlFile)
    .pipe(htmlPartial({
        basePath: './src/partials/'
    }))
    .pipe(gulpIf(isProd, htmlmin({
        collapseWhitespace: true
    })))
    .pipe(gulp.dest('./aplication'))
    .pipe(browsersync.stream());

}


// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // fancyapps
  var swiperjs = gulp.src('./node_modules/@fancyapps/fancybox/dist/*')
    .pipe(gulp.dest('./aplication/vendor/fancybox/js'));
  // swiperjs
  var swiperjs = gulp.src('./node_modules/swiper/js/*')
    .pipe(gulp.dest('./aplication/vendor/swiper/js'));
  // swiperCss
  var swipercss = gulp.src('./node_modules/swiper/css/*')
    .pipe(gulp.dest('./aplication/vendor/swiper/css'));
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./aplication/vendor/bootstrap'));
  // Font Awesome CSS
  var fontAwesomeCSS = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/**/*')
    .pipe(gulp.dest('./aplication/vendor/fontawesome-free/css'));
  // Font Awesome Webfonts
  var fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
    .pipe(gulp.dest('./aplication/vendor/fontawesome-free/webfonts'));
  // jQuery Easing
  var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./aplication/vendor/jquery-easing'));
  // PapperJs
  var PapperJs = gulp.src('./node_modules/@popperjs/core/**/*')
    .pipe(gulp.dest('./aplication/vendor/popperjs'));
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./aplication/vendor/jquery'));
  return merge(bootstrap, fontAwesomeCSS, fontAwesomeWebfonts, jquery, jqueryEasing, swipercss, swiperjs);
}

// img task
function img() {
  return gulp.src('./src/img/*')
      .pipe(gulpIf(isProd, imagemin()))
      .pipe(gulp.dest('./aplication/img/'));
}

// CSS task
function css() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./aplication/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./aplication/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src([
      './src/js/*.js',
      '!./src/js/*.min.js'
    ])
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./aplication/js'))
    .pipe(browsersync.stream());
}

// fonts task
function fonts() {
  return gulp
    .src([
      './src/fonts/*'
    ])
    .pipe(gulp.dest('./aplication/fonts'));
}

// Watch files
function watchFiles() {
  gulp.watch("./src/**/*.html", html);
  gulp.watch("./src/scss/**/*", css);
  gulp.watch("./src/img/*", img);
  gulp.watch(["./src/js/**/*", "!./src/js/**/*.min.js"], js);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js, html, img, fonts));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.html = html;
exports.fonts = fonts;
exports.img = img;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
