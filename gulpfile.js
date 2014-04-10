// Generated by CoffeeScript 1.7.1
(function() {
  var changed, coffee, component, concat, gulp, header, jade, livereload, lr, open, paths, prefix, size, stylus, uglify, util;

  gulp = require('gulp');

  coffee = require('gulp-coffee');

  jade = require('gulp-jade');

  stylus = require('gulp-stylus');

  concat = require('gulp-concat');

  uglify = require('gulp-uglify');

  util = require('gulp-util');

  component = require('gulp-component');

  changed = require('gulp-changed');

  livereload = require('gulp-livereload');

  prefix = require('gulp-autoprefixer');

  header = require('gulp-header');

  size = require('gulp-size');

  open = require('open');

  lr = require('tiny-lr')();

  paths = {
    src: {
      scripts: ['src/coffee/*.coffee'],
      css: ['src/stylus/*.styl'],
      html: ['src/jade/*.jade']
    },
    component: {
      src: 'component.json',
      build: 'public/libs'
    },
    build: {
      scripts: 'public/js',
      css: 'public/css',
      html: 'public'
    }
  };

  gulp.task('coffeescript', function() {
    return gulp.src(paths.src.scripts).pipe(coffee()).pipe(concat('main.js')).pipe(header("/* " + new Date() + " */")).pipe(size({
      showFiles: true
    })).pipe(gulp.dest(paths.build.scripts));
  });

  gulp.task('stylus', function() {
    return gulp.src(paths.src.css).pipe(stylus({
      set: ["compress"]
    })).pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7")).pipe(concat('all.css')).pipe(header("/* " + new Date() + " */")).pipe(size({
      showFiles: true
    })).pipe(gulp.dest(paths.build.css));
  });

  gulp.task('jade', function() {
    return gulp.src(paths.src.html).pipe(jade({
      pretty: true
    })).pipe(header("<!-- " + new Date() + " -->")).pipe(size({
      showFiles: true
    })).pipe(gulp.dest(paths.build.html));
  });

  gulp.task('build', function() {
    return gulp.src(paths.component.src).pipe(component({
      standalone: false
    })).pipe(gulp.dest(paths.component.build));
  });

  gulp.task('staticsvr', function() {
    var Config, server, staticS;
    staticS = require('node-static');
    server = new staticS.Server('./' + 'public');
    Config = {
      port: 1234,
      livereloadport: 35729
    };
    require('http').createServer(function(request, response) {
      request.addListener('end', function() {
        server.serve(request, response);
      }).resume();
    }).listen(Config.port, function() {
      util.log('Server listening on port: ' + util.colors.magenta(Config.port));
    });
    lr.listen(Config.livereloadport);
    util.log(util.colors.yellow("Livereload listening on port " + Config.livereloadport));
    open("http://localhost:" + Config.port);
  });

  gulp.task('reload', function() {
    var server;
    server = livereload(lr);
    return gulp.watch(paths.build.html + '/**').on('change', function(file) {
      return server.changed(file.path);
    });
  });

  gulp.task('watch', ['staticsvr', 'reload'], function() {
    gulp.watch(['src/**/*.coffee'], ['coffeescript']);
    gulp.watch(['src/**/*.styl'], ['stylus']);
    gulp.watch(['src/**/*.jade'], ['jade']);
    return gulp.watch('component.json', ['build']);
  });

  gulp.task('default', ['coffeescript', 'stylus', 'jade', 'build', 'watch']);

}).call(this);
