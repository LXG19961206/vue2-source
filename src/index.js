// options Api 通过一个选项进行配置
import { initMixin } from './init'
import { lifeCycleMinix } from './liftcycle'
import { renderMixin } from './vdom/index.js'
import { initGlobalApi } from './global-api/index'
import { stateMixin } from './state'
// 用 Vue 的构造函数，创建组件
function Vue (options) {
  this._init(options)
}

initMixin(Vue) // init 方法
lifeCycleMinix(Vue) // _update
renderMixin(Vue) // _render
// 初始化全局的 api
initGlobalApi(Vue)
stateMixin(Vue)


export default Vue
