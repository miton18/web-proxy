g               = require 'gulp'
gulpLoadPlugins = require 'gulp-load-plugins'
P               = gulpLoadPlugins()


g.task 'default', ['build', 'json'], ->

    g.watch './main.coffee', ['build']

    g.watch './routes.json',   ['json']

g.task 'build', ->

    g.src './main.coffee'
    .pipe P.plumber()
    .pipe P.coffee()
    .pipe P.debug
        title: '[DEBUG]'
    .pipe g.dest './build/'

g.task 'json', ->

    g.src './routes.json'
    .pipe P.plumber()
    .pipe P.jsonlint()
    .pipe P.jsonlint.reporter()
    .pipe g.dest './build/'
