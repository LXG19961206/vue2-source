import { initState } from './state'
import { compileToFunctions } from './compiler/index'
import { mountComponent,callHook } from './liftcycle'
import { mergeOptions } from './util'
export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    // 将用户传递的和全局的内容进行合并
    vm.$options = mergeOptions(vm.constructor.options, options)
    // 初始化状态(将数据做一个初始化的劫持,当数据改变时候更新视图)
    // vue组件中有很多状态 data,props,watch,computed

    callHook(vm, 'beforeCreate')

    initState(vm);

    callHook(vm, 'created')

    // vue里面核心特新 响应式数据原理
    // vue 是什么样子的框架 借鉴了 MVVM

    // 数据变化视图会更新, 视图变化视图会被影响
    // 但是 MVVM 不能跳过数据去更新视图,但是 Vue 可以通过 refs 直接修改视图内容

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    vm.$el = el
    const opt = vm.$options
    if(!opt.render) {
      // 如果没有 render 方法
      // 将 template 转化为 render 方法
      if(!opt.template && el) {
        opt.template = el.outerHTML
      }
      // 将 模版 编译为 render 函数
      opt.render = compileToFunctions(opt.template)
    }
    // 渲染时候用的都是 这个 render 方法
    mountComponent(vm, el)
  }
}
