import { arrayMethods } from './array'
import Dep from './dep.js'
console.log(Dep, 2323)
import { defineProperty } from '../util'
export function observe (data) {
  if(data.__ob__) return data
  if(data && typeof data  === 'object') {
    // data必须是一个对象
    return new Observer(data)
  }
}

class Observer {
  constructor(value) {
    this.dep = new Dep();
    // 使用 defineProperty 来重新定义属性
    if(Array.isArray(value)) {
      // 函数劫持, 重写数组的方法,再调用原方法的同时,又去做了一些响应式处理的逻辑
      value.__proto__ = arrayMethods
      // 观测数组的对象类型,对象变化也做一些事情
      this.observeArray(value)
      // 判断一个对象是否被观测过
      defineProperty(value, '__ob__',this)
    } else {
      this.walk(value)
    }
  }
  observeArray (value) {
    value.forEach(item => {
      observe(item)
    })
  }
  walk (data) {
    let keys = Object.keys(data) // 获取对象的key
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive (data,key,value) {
  // 为了实现了深层对象的处理, 首先递归地执行 observe 进行判断,如果还是一个对象类型的话
  // 这样会导致性能比较差

  // 获取到数组对应的 dep
  let childDep = observe(value)
  // 每个属性都有一个 dep 属性，用于存放 watcher
  // 当页面取值时候，说明这个值用来渲染了，此时将这个 属性和 watcher 对应起来
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get () {
      if(Dep.target) { // 让这个属性记住这个 watcher
          dep.depend()
          if(typeof childDep === 'object') {
            childDep.dep.depend() // 数组存起来这个渲染过程
          }
      }
      return value
    },
    set (newValue) {
      if(newValue === value) return
      // 如果用户传进来的依旧是个对象的话,对这个对象依旧使用 observe 方法
      observe(newValue)
      value = newValue
      dep.notify()
    }
  })

}

// 但是要对数组进行特殊的操作
// 确实使用 defineProperty确实可以对数组进行拦截,但是如果是个巨大的数组, 会导致性能很差
// 于是 Vue 直接重写了数组的常用方法, 在你调用这些方法时候,添加了一些实现了响应式的逻辑
// -- push , pop ,shift , unshift , splice , sort ,reserve
