fs = require 'fs'

command       = process.argv[2];
newRoute      = {}
newRoute.sdom  = process.argv[3];
newRoute.port = process.argv[4];

fs.readFile 'build/routes.json', 'utf8', (err, data)->

  console.log err if err?
  routes = JSON.parse data

  del = ->

    for key, route of routes
      if route.sdom == newRoute.sdom
        indice = key

    if indice?
      routes.splice indice , 1

  add = ->

    routes.push newRoute

  switch  command
    when 'add' then add()
    when 'del' then del()


  console.log routes
  fs.writeFile 'build/routes.json', JSON.stringify(routes), (err)->

    console.log err if err?
    console.log 'Done!' unless err


