var http = require('http')
var url = require('url')
var render = require('./common/render')
var router = require('./router')
var config = require('./config')

http
  .createServer(function (req, res) {

    var urlObj = url.parse(decodeURI(req.url), true)

    req.pathname = urlObj.pathname
    req.query = urlObj.query

    // 给 res 对象挂载 render 渲染函数
    render(res)

    // 我希望我的 router 里面不要有太多的职责
    // 对于一些公共的处理
    // 例如处理查询字符串
    // 处理 render 方法
    // router 希望它能纯粹一些
    // 只是使用 req 或者 res 中的一些成员
    // 然后只做分发这件事儿
    // 就是根据不同的请求路径分发到具体的请求处理
    router(req, res)
  })
  .listen(config.port, function () {
    console.log('服务器已启动，请访问：http://127.0.0.1:' + config.port + '/')
  })
