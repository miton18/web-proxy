g               = require 'gulp'
gulpLoadPlugins = require 'gulp-load-plugins'
P               = gulpLoadPlugins()


g.task 'default', ['build'], ->

    g.watch 'src/*.coffee', ['build']

g.task 'build', ->

    g.src 'src/*.coffee'
    .pipe P.plumber()
    .pipe P.coffee()
    .pipe P.debug
        title: '[DEBUG]'
    .pipe g.dest 'build/'