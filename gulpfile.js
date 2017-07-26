const runSequence = require('run-sequence');
const gulp = require('gulp');
let isDev = false;
let isProd = false;
let isTest = false;

// task: upd-oojs (to update oojs library from oojs repo, in appgears development)
gulp.task('upd-oojs', (done) => {
    let updater = require('./build/task-upd-oojs.js').updater;
    updater(isDev, isProd, isTest, done);    
});

// task: upd-ag (to update appgears files from appgears repo)
// to be used during development of a project based on appgears
gulp.task('upd-ag', (done) => {
    let updater = require('./build/task-upd-ag.js').updater;
    updater(isDev, isProd, isTest, done);
});

// task: clean (to delete all generated files)
gulp.task('clean', (done) => {
    let cleaner = require('./build/task-clean.js').cleaner;
    cleaner(isDev, isProd, isTest, done);
});

// task: cfg (to generate .config.json file)
gulp.task('cfg', (done) => {
    let generator = require('./build/task-cfg.js').generator;
    generator(isDev, isProd, isTest, done);
});

// task: cfg-clean (to delete generated .config.json file)
gulp.task('cfg-clean', (done) => {
    let trasher = require('./build/task-cfg-clean.js').trasher;
    trasher(isDev, isProd, isTest, done);
});

// task: process templates (to regenerate all templatzed files)
gulp.task('tmpl', (done) => {
    let processor = require('./build/task-tmpl.js').processor;
    processor(isDev, isProd, isTest, done);
});

// task: asm (to generate .asm.js files for each assembly folder)
const asms = {
    paths: {},
    bundles: {}
};
gulp.task('asm', (done) => {
    let assembler = require('./build/task-asm.js').assembler;
    assembler(isDev, isProd, isTest, asms, done);
});

// task: compress (minify files)
gulp.task('compress', (done) => {
    let compressor = require('./build/task-compress.js').compressor;
    compressor(isDev, isProd, isTest, done);
});

// task: env (generate env data for loader)
gulp.task('env', (done) => {
    let generator = require('./build/task-env.js').generator;
    generator(isDev, isProd, isTest, asms, done);
});

// task: docs (generate docs)
gulp.task('docs', (done) => {
    let generator = require('./build/task-docs.js').generator;
    generator(isDev, isProd, isTest, done);
});

// task: tst
gulp.task('tst', (done) => {
    let tester = require('./build/task-test.js').tester;
    tester(isDev, isProd, isTest, done);
});


// Execution sequences
// task: test
gulp.task('test', (cb) => {
    isDev = false;
    isProd = false;
    isTest = true;
    runSequence('clean', 'cfg', 'tmpl', 'asm', 'env', 'cfg-clean', 'tst', cb);
});

// task: build (dev)
gulp.task('dev', (cb) => {
    isDev = true;
    isProd = false;
    isTest = false;
    runSequence('clean', 'cfg', 'tmpl', 'env', 'cfg-clean', cb);
});

// task: build (dbg)
gulp.task('dbg', (cb) => {
    isDev = false;
    isProd = false;
    isTest = false;
    runSequence('clean', 'cfg', 'tmpl', 'asm', 'env', 'cfg-clean', cb);
});

// task: build (prod)
gulp.task('prod', (cb) => {
    isDev = false;
    isProd = true;
    isTest = false;
    runSequence('clean', 'cfg', 'tmpl', 'asm', 'env', 'compress', 'cfg-clean', 'docs', cb);
});

// task: default
gulp.task('default', ['dev'], () => {
});