var handler = require('./handler')

// router 模块
// 职责：匹配请求路径，分发具体的处理函数
//       这就叫路由

module.exports = function (req, res) {
  
  var pathname = req.pathname
  var method = req.method.toLowerCase()

  if (method === 'get' && pathname.startsWith('/static/')) {
    // 调用某个处理函数
    handler.handleStatic(req, res)
  } else if (method === 'get' && pathname === '/') {
    handler.showIndex(req, res)
  } else if (method === 'get' && pathname === '/submit') {
    handler.showSubmit(req, res)
  } else if (method === 'post' && pathname === '/submit') {
    handler.doSubmit(req, res)
  } else if (method === 'get' && pathname == '/login') {
    handler.showLogin(req, res)
  } else if (method === 'get' && pathname === '/add') {
    handler.doAdd(req, res)
  } else if (method === 'get' && pathname === '/item') {
    handler.showItem(req, res)
  }
}
