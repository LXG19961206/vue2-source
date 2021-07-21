import { observe } from './Observer/index'
import { nextTick, proxy } from './util'
import { Watcher } from './Observer/watcher'
import Dep  from './Observer/dep'
export function initState (vm) { // vm.$options
  const opts = vm.$options;
  if(opts.props) {
    initProps(vm)
  }
  if(opts.methods) {
    initMethods(vm)
  }
  if(opts.data) {
    initData(vm)
  }
  if(opts.computed) {
    initComputed(vm)
  }
  if(opts.watch) {
    initWatch(vm)
  }
}

function initProps() {

}

function initMethods() {

}

function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data
  observe(data)
  // 数据的劫持方案 对象 Object.defineProperty 方法
  // 数组会单独处理

  // 当我去 vm 上取值时候,帮我把值代理到 vm._data上
  for(let key in data ){
    proxy(vm,'_data',key)
  }
}
function initComputed(vm) {
  let computed = vm.$options.computed
  // -> 需要有一个 watcher
  const watchers = vm._computedWatchers = {}
  // -> 需要有一个 defineProperty
  for(let key in computed) {
    const userDef = computed[key]
    // -> 获取 getter 方法
    //    -> 因为 computed 既可以传一个函数，又可以传一个对象
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm,getter, () => {})
    defineComputed(vm,key,userDef, { lazy: true })
  }
  // -> 需要一个 dirty
}

function defineComputed (target ,key , userDef) {
  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    set: () => {},
    get: ()=> {}
  }
  if(typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key)
  } else {
    sharedPropertyDefinition.get = createComputedGetter(key)
    sharedPropertyDefinition.set = userDef.set
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter (key) {
  return function () {
    // 此方法是我们包装的方法,每次取值会调用此方法,此方法会判断到底需不需要执行用户传递的方法
    const watcher = this._computedWatchers[key] // 拿到这个属性对应的 watcher , 因为这个方法最终会被其实例执行,所以 this 其实就是 vm
    if(watcher) {
      if(watcher.dirty) { // 默认是脏的
        watcher.evaluate() // 对当前方法进行求值
      }
      if(Dep.target) {
        watcher.depend()
      }
      debugger
      return watcher.value // 会默认返回 上一次的值
    }
  }
}
function createWatcher(vm,exprOrFn,handler,options) { // options 可以用来标识是用户 watcher
  if(typeof handler === 'object') {
    options = handler
    handler = handler.handler
  }
  if(typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(exprOrFn, handler, options)
}

function initWatch(vm) {
  let { watch } = vm.$options
  for(let key in watch) {
    const handle = watch[key]
    if(Array.isArray(handle)) {
      handle.forEach(handle => createWatcher(vm,key,handle))
    } else {
      createWatcher(vm, key , handle)
    }
  }
}

export function stateMixin (Vue) {
  Vue.prototype.$nextTick = function (cb) {
    nextTick(cb)
  }
  Vue.prototype.$watch = function (exprOrFn, cb, options) {
    console.log(exprOrFn,cb,options)
    // 数据变化后，应该让 watcher 重新执行
    new Watcher(this,exprOrFn,cb,{
      ...options,
      user: true
    })
    if (options && options.immediate) {
      cb()
    }
  }
}
