import { pushTarget,popTarget } from '../Observer/dep'
import { nextTick } from "../util";

let id = 0
export class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.exprOrFn = exprOrFn
    this.callback = callback
    this.options = options
    // 如果watcher上有 lazy 属性, 说明是一个计算属性
    // dirty 代表取值时候是否执行用户提供的方法
    this.lazy = options && options.lazy
    this.dirty = this.lazy
    this.user = options ? options.user: null; // 这是一个用户 watcher
    this.id = id++ // 是 watcher 的唯一标识
    this.deps = [] // 记住 watcher 有多少 dep 关注它
    this.depsId = new Set()
    if(typeof exprOrFn === 'function') {
      this.getter = exprOrFn
    } else {
      this.getter = function () { // exprOrFn 可能传递额是一个字符串
        // 当去当前实例上进行取值的时候，才会去进行依赖收集
        let path = exprOrFn.split('.')
        let obj = vm;
        for (let i =0 ; i < path.length ; i ++) {
          obj = obj[path[i]]
        }
        return obj
      }
    }
    // 默认会进行一次 get 方法， 进行取值 ， 将结果保留起来
    this.value = this.lazy ? void 0 : this.get() // 默认会调用 get 方法
  }

  addDep (dep) {
    let { id } = dep
    if(!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }
  get () {
    // 当我们渲染时候会调用这个方法
    // -- 渲染之前将 watcher 放在全局上
    // -- 因为之前为值 设置了 Object.defineProperty
    // -- 取值的时候会触发 getter
    // -- 这个时候让 dep 记住当前的 watcher
    // -- 让用户赋值的时候会触发 set
    // -- 等会属性更新了，就重新调用渲染逻辑 ；触发 set 时候，遍历 dep 中的 watcher 来执行

    pushTarget(this) // 当前 watcher 实例
    let result = this.getter.call(this.vm) // 调用 exprOrFn，渲染页面
    popTarget()
    return result
  }
  run () {
    let oldValue = this.value
    let newValue = this.get()
    this.value = newValue
    if(this.user) {
      this.callback.call(this.vm,newValue,oldValue)
    }
  }
  depend () {
    // 计算属性 watcher 会存储 dep
    // 通过 watcher 找到对应的 所有的 dep ,再让 dep 都记住这个 watcher
    let i = this.deps.length
    while(i--) {
      // 让 dep 去存储渲染 watcher
      this.deps[i].depend()
    }
  }
  update () {
    // 这个里面不要每次调用 get 方法， get 方法会重新绘制页面
    // 暂存的概念
    if(this.lazy) {
      this.dirty = true; // 页面重新渲染就可以获取最新值
    } else {
      queueWatcher(this)
    }
  }
}
let queue = [],has = {},pending = false
// 将需要批量更新的 watcher 放在一个队列中，稍后让 watcher 执行
function queueWatcher (watcher) {
  const { id } = watcher
  if(!has[id]) {
    queue.push(watcher);
    window.queue = queue
    has[id]  = true
    if(!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}
// 刷新当前队列
function flushSchedulerQueue () {
    queue.forEach(watcher => {watcher.run(); !watcher.user && watcher.callback()})
    queue = []
    has = {}
    pending = false
}
