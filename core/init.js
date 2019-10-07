/**
 * core中放置公共的方法和类
 * 初始化文件
 */

const requireDirectory = require('require-directory')
const Router = require('koa-router')

class InitManager {
  // 入口方法，需要传入app对象
  static initCore(app) {
    InitManager.app = app
    InitManager.initLoadRouters()
  }

  // 加载全部路由
  static initLoadRouters() {
    const apiDirectory = `${process.cwd()}/app/routes`
    requireDirectory(module, apiDirectory, {
      visit: whenLoadModule
    })

    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager
