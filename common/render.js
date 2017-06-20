var fs = require('fs')
var path = require('path')
var _ = require('underscore')
var config = require('../config')

function render(res) {
  res.render = function (viewName, tplObj) {
    fs.readFile(path.join(config.viewPath, viewName + '.html'), 'utf8', function (err, data) {
      if (err) {
        throw err
      }
      data = _.template(data)(tplObj || {})
      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.end(data)
    })
  }
}

module.exports = render
