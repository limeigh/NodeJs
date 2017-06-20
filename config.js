var path = require('path')

module.exports = {
  port: 3000,
  dataPath: path.join(__dirname, 'data.txt'),
  viewPath: path.join(__dirname, 'views')
}
