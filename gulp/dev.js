const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
// const babel = require("gulp-babel");
// const imageMin = require("gulp-imagemin");
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

gulp.task("clean:dev", function (done) {
  if (fs.existsSync(".build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: true }));
  }

  done();
});

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

// , { hasChanged: changed.compareContents } это надо для пересборки страницы, если в импортах изменения
gulp.task("html:dev", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./build/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberConfig("Html")))
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest("./build/"));
});

gulp.task("sass:dev", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./build/css/"))
    .pipe(plumber(plumberConfig("Styles")))
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(sassGlob())
    .pipe(gulp.dest("./build/css"));
});

gulp.task("img:dev", function () {
  return (
    gulp
      .src("./src/img/**/*")
      .pipe(changed("./build/img/"))
      // .pipe(imageMin({ verbose: true }))
      .pipe(gulp.dest("./build/img/"))
  );
});

gulp.task("fonts:dev", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts/"))
    .pipe(gulp.dest("./build/fonts/"));
});

gulp.task("files:dev", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files/"))
    .pipe(gulp.dest("./build/files/"));
});

gulp.task("js:dev", function () {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./build/js/"))
      .pipe(plumber(plumberConfig("Js")))
      // .pipe(babel())
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./build/js/"))
  );
});

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:dev", function () {
  return gulp.src("./build/").pipe(server(serverOptions));
});

gulp.task("watch:dev", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/html/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("img:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
});
