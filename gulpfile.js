const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
// const groupMedia = require("gulp-group-css-media-queries");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");

gulp.task("clean", function (done) {
  if (fs.existsSync(".dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean({ force: true }));
  }

  done();
});

//to run in console:  gulp Taskname
// gulp.task("Taskname", function (done) {
//   console.log("Hello");

//   done();
// });

// console: gulp
// gulp.task("default", gulp.series("Taskname"));

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};


const plumberHtmlConfig = {
  errorHandler: notify.onError({
    title: "Html",
    message: "Error <%= error.message %>",
    sound: false,
  }),
};


//to run in console:  gulp fileListInclude
// gulp.task("fileListInclude", function () {
gulp.task("html", function () {
  return gulp
    .src("./src/*.html")
    .pipe(plumber(plumberHtmlConfig))
    .pipe(fileInclude(fileIncludeSettings).pipe(gulp.dest("./dist/")));
});

const plumberSassConfig = {
  errorHandler: notify.onError({
    title: "Styles",
    message: "Error <%= error.message %>",
    sound: false,
  }),
};

gulp.task("sass", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(plumber(plumberSassConfig))
      .pipe(sourceMaps.init())
      .pipe(sass())
      // .pipe(groupMedia())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./dist/css"))
  );
});

// gulp.task("copyImg", function () {
gulp.task("img", function () {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./dist/img/"));
});

const serverOptions = {
  livereload: true,
  open: true,
};

// gulp.task("startServer", function () {
gulp.task("server", function () {
  return gulp.src("./dist/").pipe(server(serverOptions));
});

gulp.task("watch", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("./src/**/*.html", gulp.parallel("html"));
  gulp.watch("./src/img/**/*", gulp.parallel("img"));
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "img"),
    gulp.parallel("server", "watch")
  )
);
