import {mergeOptions} from "../util";
export function initExtend (Vue) {
  // 核心就是创建一个子类继承我们的父类
  Vue.extend = function (params) {
    const Super = this
    const Sub = function VueComponent(options) {
      this._init(options)
    }
    // 子类继承父类原型上的方法
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.options = mergeOptions(
      Super.options,
      this.options
    )

    return Sub
  }
}


// 组件的渲染流程
// -> 调用Vue.component
// -> 内部使用了 Vue.extend , 就是产生一个子类来继承父类
// -> 创建子类实例时候会调用父类的 _init 方法,再去 $mount 即可
// -> 组件的初始化其实就是 new 了这个组件 并且调用了上面的 $mount 方法
// -> 组件的合并策略 , 采用的是就近策略, 我们可以将全局组件放到原型链上, 这样当自己没有的时候才去找全局的
