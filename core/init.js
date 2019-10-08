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
    InitManager.loadConfig()
    InitManager.initLoadRouters()
    InitManager.loadHttpException()
  }

  // 加载配置文件
  static loadConfig(path = '') {
    const configPath = path || process.cwd() + '/config/config.js'
    const config = require(configPath)
    global.config = config
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

  // 将所有的异常类装载到global.errs
  static loadHttpException(){
    const errors = require('./http-exception')
    global.errs = errors
  }
}

module.exports = InitManager
