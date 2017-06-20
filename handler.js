var fs = require('fs')
var path = require('path')
// mime是一个互联网标准，通过设定它就可以设定文件在浏览器的打开方式
var mime = require('mime')
var config = require('./config')
var querystring = require('querystring')

var dataPath = config.dataPath

// handler 模块
// 就是提供处理函数

exports.handleStatic = function (req, res) {
  var pathname = req.pathname
  var filePath = path.join(__dirname, pathname)
  fs.readFile(filePath, function (err, data) {
    if (err) {
      return res.end('404')
    }
    res.writeHead(200, {
      'Content-Type': mime.lookup(filePath)
    })
    res.end(data)
  })
}

exports.showIndex = function (req, res) {
  fs.readFile(dataPath, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    data = JSON.parse(data)
    res.render('index', {
      title: '黑客新闻',
      list: data.list
    })
  })
}

exports.showSubmit = function (req, res) {
  res.render('submit')
}

exports.showLogin = function (req, res) {
  res.render('login', {
    title: '登陆标题'
  })
}

exports.doAdd = function (req, res) {
  fs.readFile(dataPath, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    data = JSON.parse(data)
    data.list.push(req.query)
    // console.log(req.query)
    data = JSON.stringify(data)
    fs.writeFile(dataPath, data, function (err) {
      if (err) {
        throw err
      }
      // 处理完毕，根据这里的规则，让客户端跳转到 / 首页
      res.writeHead(302, {
        'Location': '/'
      })
      res.end()
    })
  })
}

exports.doSubmit = function (req, res) {
  // 对于表单 POST 请求来说，由于数据量比较大，所以客户端在提交数据的时候
  // 会分为多次进行提交，也就是一点儿一点儿的上传
  // 也就是说不可能像 get 请求参数一样，直接通过解析一次 url 就能获取到
  // 这个时候需要通过一种特殊的机制来接收表单 POST 提交的数据

  // Node 接收到表单POST提交的数据的时候，如果数据量大，则会接收多次
  // 只要接收到一点儿数据，就会触发一次 req 对象的 data 事件，然后把接收到的数据传递给对应的事件处理函数
  // chunk 是一个二进制数据
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })

  // 当 Node 接收完毕表单 POST 提交的数据的时候，会触发 req 请求对象的 end 事件，执行对应的回调处理函数
  req.on('end', function () {

    // 使用核心模块 querystring 的 parse 方法将一个查询字符串转为一个对象
    body = querystring.parse(body)

    fs.readFile(dataPath, 'utf8', function (err, data) {
      if (err) {
        throw err
      }
      data = JSON.parse(data)
      var id = 0
      data.list.forEach(function (item) {
        if (item.id > id) {
          id = item.id
        }
      })
      body.id = id + 1
      data.list.push(body)
      data = JSON.stringify(data)
      fs.writeFile(dataPath, data, function (err) {
        if (err) {
          throw err
        }
        // 处理完毕，根据这里的规则，让客户端跳转到 / 首页
        res.writeHead(302, {
          'Location': '/'
        })
        res.end()
      })
    })
  })
}

exports.showItem = function (req, res) {
  var id = parseInt(req.query.id)
  // 根据ID找到对应的数据
  // 读取模板字符串
  // 通过模板引擎将数据和模板字符串解析替换到一起，最后发送给用户
  fs.readFile(dataPath, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    data = JSON.parse(data)
    var obj
    data.list.forEach(function (item) {
      if (item.id === id) {
        obj = item
      }
    })
    if (!obj) {
      return res.end('No such item.')
    }
    res.render('item', {
      item: obj
    })
  })
}
