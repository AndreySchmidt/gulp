const gulp = require("gulp");

//html
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");

//css
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");

const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");

//img
const imageMin = require("gulp-imagemin");
const webp = require("gulp-webp");

const changed = require("gulp-changed");

const plumberConfig = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= error.message %>",
      sound: false,
    }),
  };
};

gulp.task("clean:docs", function (done) {
  if (fs.existsSync(".docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }

  done();
});

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html:docs", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./docs/"))
    .pipe(plumber(plumberConfig("Html")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(htmlclean())
    .pipe(gulp.dest("./docs/"));
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css/"))
    .pipe(plumber(plumberConfig("Styles")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("img:docs", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./docs/img/"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/img/"))
    
    .src("./src/img/**/*")
    .pipe(changed("./docs/img/"))
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest("./docs/img/"));
});

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js/"))
    .pipe(plumber(plumberConfig("Js")))
    .pipe(babel())
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(server(serverOptions));
});
