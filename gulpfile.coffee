gulp = require 'gulp'
coffee = require 'gulp-coffee'
jade = require 'gulp-jade'
stylus = require 'gulp-stylus'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
util = require 'gulp-util'
component = require 'gulp-component'
changed = require 'gulp-changed'
livereload = require 'gulp-livereload'
prefix = require 'gulp-autoprefixer'
header = require 'gulp-header'
size = require 'gulp-size'
open = require 'open'
lr = require('tiny-lr')()

paths =
  src:
    scripts: [
      'src/coffee/*.coffee'
    ]
    css: [
      'src/stylus/*.styl'
    ]
    html: [
      'src/jade/*.jade'
    ]
  component:
    src: 'component.json'
    build: 'public/libs'
  build:
    scripts: 'public/js'
    css: 'public/css'
    html: 'public'

gulp.task 'coffeescript', ()->
  gulp.src paths.src.scripts
    # .pipe changed(paths.build.scripts,{extension :'js'})
    .pipe coffee()
    .pipe concat 'main.js'
    .pipe header "/* " + new Date() + " */" # include a header showing the date the file was generated
    .pipe size # see how big the resulting file is
      showFiles: true
    .pipe gulp.dest paths.build.scripts

gulp.task 'stylus', ()->
  gulp.src paths.src.css
    # .pipe changed(paths.build.css,{extension :'css'})
    .pipe stylus
      set: ["compress"]
    .pipe prefix "last 1 version", "> 1%", "ie 8", "ie 7" # add vendor prefixes
    .pipe concat 'all.css'
    .pipe header "/* " + new Date() + " */" # include a header showing the date the file was generated
    .pipe size # see how big the resulting file is
      showFiles: true
    .pipe gulp.dest paths.build.css

gulp.task 'jade', ()->
  gulp.src paths.src.html
    # .pipe changed(paths.build.html,{extension :'html'})
    .pipe jade
      pretty: true
    .pipe header "<!-- " + new Date() + " -->" # include a header showing the date the file was generated
    .pipe size # see how big the resulting file is
      showFiles: true
    .pipe gulp.dest paths.build.html

gulp.task 'build', ()->
  gulp.src paths.component.src
    .pipe component
      standalone: false
    .pipe gulp.dest paths.component.build

gulp.task 'staticsvr', ()->
  staticS = require 'node-static'
  server = new staticS.Server './' + 'public'
  Config =
    port : 1234
    livereloadport : 35729

  require 'http'
    .createServer (request, response)->
      request.addListener 'end', ()->
        server.serve request, response
        return
      .resume()
      return
    .listen Config.port, ()->
      util.log 'Server listening on port: ' + util.colors.magenta(Config.port)
      return
  lr.listen Config.livereloadport
  util.log util.colors.yellow("Livereload listening on port " + Config.livereloadport)
  open("http://localhost:"+Config.port)
  return

gulp.task 'reload', ()->
  server = livereload(lr)
  gulp.watch paths.build.html + '/**'
    .on 'change', (file)->
      server.changed file.path

gulp.task 'watch', ['staticsvr','reload'], ()->
  gulp.watch ['src/**/*.coffee'], ['coffeescript']
  gulp.watch ['src/**/*.styl'], ['stylus']
  gulp.watch ['src/**/*.jade'], ['jade']
  gulp.watch 'component.json', ['build']

gulp.task 'default', ['coffeescript', 'stylus', 'jade', 'build', 'watch']