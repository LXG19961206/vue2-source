export function renderMixin (Vue) {
  Vue.prototype._c = function (...arg) {
    return createElement(...arg)
  }

  Vue.prototype._s = function (val) { // stringify
    return val === null ? '' : (typeof val === 'object') ? JSON.stringify(val) : val
  }

  Vue.prototype._v = function (text) {
    return createTextVnode(text)
  }
  Vue.prototype._render = function () {
    const vm = this
    const render = vm.$options.render
    return render.call(vm)
  }
}

export function createElement (tag, data = {}, ...children) {
  return vnode(tag,data,data.key,children)
}

export function createTextVnode (text) {
  return vnode(undefined,undefined,undefined,undefined,text)
}
// 用于产生虚拟 dom
function vnode (tag,data,key,children,text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}
