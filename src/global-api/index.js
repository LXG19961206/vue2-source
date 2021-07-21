import { mergeOptions } from '../util'
import {initExtend} from "./extent";
export function initGlobalApi (Vue) {
    // 整个了 所有的全局相关的内容
    Vue.options = {}
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin)
    }
    Vue.options.components = {}

    Vue.options._base = Vue // 指的就是 vue 的构造函数

    initExtend(Vue);

    Vue.component = function (id, definition) {
      definition.name = definition.name || id
      // 根据当前组件对象生成了子类的构造函数
      // 用的时候,得 new 一个 definition().$mount
      definition = this.options._base.extend(definition) // 永远是父类
      Vue.options.components[id] = definition
    }


    // 生命周期的合并策略,把同名的生命周期维护到一个数组里
}
