
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const postcss      = require('gulp-postcss');
const pug          = require('gulp-pug');
const autoprefixer = require('autoprefixer');
const cssnano      = require('cssnano');
const sourcemaps   = require('gulp-sourcemaps');
const connect      = require('gulp-connect-php');
const browserSync  = require('browser-sync');
const del          = require('del');
const browserify   = require('browserify');
const babelify     = require('babelify');
const source       = require('vinyl-source-stream');
const buffer       = require('vinyl-buffer');
const uglify       = require('gulp-uglify');
const livereload   = require('gulp-livereload');
const iconFont     = require('gulp-iconfont');
const rename       = require("gulp-rename");
const consolidate  = require('gulp-consolidate');
const runTimestamp = Math.round(Date.now() / 1000);

require('dotenv').config();

// Environment variables
const PORT = process.env.PORT || '8000';
const HOSTNAME = process.env.HOSTNAME || 'localhost';

// Local variables
const SRC_PATH = 'src';
const DEST_PATH = 'build';

const projectName = 'biblio';
const commomFiles = ['globals'];
const otherFiles  = ['home', 'general'];

const PATHS = {
  styles: { src: `${SRC_PATH}/assets/**/*.scss`, dest: `${DEST_PATH}/assets/css` },
  js: { src: `${SRC_PATH}/assets/**/*.js`, dest: `${DEST_PATH}/assets/js` },
  views: { src: `${SRC_PATH}/views/*.pug`, dest: `${DEST_PATH}/` },
  api: { src: `${SRC_PATH}/api/**/*.php`, dest: `${DEST_PATH}/api` },
};

function reload(done) {
  browserSync.reload();
  done();
}

function clean() {
  return del(DEST_PATH);
}

function js(done) {
  const fn = (fileName, src, dest) => {
    browserify({
      extensions: ['.js'],
      entries:  [ `${src}/${fileName}.js` ],
      debug: true
    })
    .transform('babelify', {
      presets: ['@babel/preset-env']
    })
    .bundle()
    .pipe(source(`${fileName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.stream());
  };

  commomFiles.map((file) => fn(
    `${projectName}-common-${file}`,
    `${SRC_PATH}/assets/common/js`,
    `${DEST_PATH}/assets/common/js`
  ));
  
  otherFiles.map((file) => fn(
    `${projectName}-${file}`,
    `${SRC_PATH}/assets/js`,
    `${DEST_PATH}/assets/js`
  ));

  done && done();
}

function styles(done) {
  const fn = (src, dest) => {
    gulp
      .src(src)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .on('error', sass.logError)
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dest))
      .pipe(browserSync.stream());
  };

  commomFiles.map((file) => fn(
    `${SRC_PATH}/assets/common/scss/${projectName}-common-${file}.scss`,
    `${DEST_PATH}/assets/common/css`
  ));
  
  otherFiles.map((file) => fn(
    `${SRC_PATH}/assets/scss/${projectName}-${file}.scss`,
    `${DEST_PATH}/assets/css`
  ));

  done && done();
}

function views() {
  return gulp.src(PATHS.views.src)
    .pipe(pug({
      doctype: 'html',
      pretty: true
    }))
    .pipe(gulp.dest(PATHS.views.dest))
    .pipe(browserSync.stream());
}

function iconfont() {
  gulp.src(`${SRC_PATH}/assets/common/iconfont/*.svg`).pipe(iconFont({
    fontName: `iconfont-${projectName}`,
    formats: ['eot', 'ttf', 'woff', 'woff2'],
    appendCodepoints: true,
    prependUnicode: true,
    timestamp: runTimestamp,
    normalize: true,
    fontHeight: 1001,
    centerHorizontally: true
  })).on('glyphs', function (glyphs, opts) {
    gulp.src(`${SRC_PATH}/assets/common/iconfont/template/_iconfont-template.scss`).pipe(consolidate('underscore', {
      glyphs: glyphs.map(function (glyph) {
        return {
          name: glyph.name,
          codepoint: glyph.unicode[0].charCodeAt(0)
        };
      }),
      fontName: `iconfont-${projectName}`,
      fontPath: '/assets/common/iconfont/',
      className: 'iconfont',
      customExtension: '.css'
    })).pipe(rename(function (path) {
      path.basename = `_iconfont-${projectName}`;
    })).pipe(gulp.dest(`${SRC_PATH}/assets/common/scss/settings/`));
  }).pipe(rename(function (path) {
    path.extname += '.css';
  })).pipe(gulp.dest(`${DEST_PATH}/assets/common/iconfont/`));
}

function copyApiFile() {
  gulp.src(PATHS.api.src).pipe(gulp.dest(PATHS.api.dest));
}

function start() {
  // Init server
  connect.server({
    root: `${DEST_PATH}`,
    base: `${DEST_PATH}`,
    hostname: HOSTNAME,
    port: PORT,
  });

  browserSync({
    proxy: `${HOSTNAME}:${PORT}`,
  });

  // Run the compile tasks
  copyApiFile();
  iconfont();
  styles();
  views();
  js();

  // Watchers
  gulp.watch(PATHS.styles.src, gulp.series([styles]));
  gulp.watch(PATHS.js.src, gulp.series([js]));
  gulp.watch(PATHS.views.src, gulp.series([views]));
}

exports.start = start;
exports.clean = clean;
