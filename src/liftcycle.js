import { patch } from './vdom/patch'
import { Watcher } from "./Observer/watcher";
export function lifeCycleMinix (Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const prevVnode = vm._vnode
    // 用新的创建的元素，替换调原来的 vm.$el
    if(!prevVnode) {
      // 首次渲染的逻辑
      vm.$el = patch(vm.$el, vnode)
    } else {
      // 后续渲染的逻辑
      vm.$el = patch(prevVnode, vnode)
    }
    vm._vnode = vnode
  }
}
export function mountComponent (vm, el) {
  // 调用 render 方法,生成真实 dom  去渲染 el 属性
  // 先调用 render 方法,创建一个虚拟节点,再将虚拟节点渲染到页面上
  // 这个方法是 vue 的核心内容
  callHook(vm, 'beforeMount')
  const updateComponent = () => {
    vm._update(vm._render())
  }
  // watcher 用于渲染的，目前没有任何功能
  new Watcher(vm, updateComponent, () => {
    callHook(vm, 'updated')
  }, true)
  callHook(vm, 'mounted')
}

export function callHook (vm, hook) {
  const handlers = vm.$options[hook]
  if(handlers) {
    // 需要处理好生命周期中的 this，所以使用了 call
    handlers.forEach(fn => fn.call(vm))
  }
}
