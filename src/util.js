
function mergeHook (parentVal, childValue) {
  // 生命周期的合并
  if(childValue) {
    if(parentVal) {
      return parentVal.concat(childValue)
    } else {
      return [childValue]
    }
  } else {
    return parentVal
  }
}
let callbacks= []

let timerFunc = undefined,pending = false
if(Promise) {
  timerFunc = function () {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  // 可以监控 dom 的变化，监控完毕后会异步更新
  let observe = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, { characterData: true})
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (window.setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks)
  }
}

export function nextTick (cb) {
  callbacks.push(cb);
  // Vue 3 的 nextTick 原理就是 promise.then
  !pending && timerFunc();
}

function flushCallbacks () {
  while(callbacks.length){
    // 让 nextTick 中传入的方法一次执行
    callbacks.pop()()
  }
  pending = false // 并且标识已经执行完毕
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed'
]

let strats = {}
strats.components = function (parentVal,childVal) {
  const res = Object.create(parentVal) // res.__proto__ = parentVal
  if(childVal) {
    for (let key in childVal) res[key] = childVal[key]
  }
  return res
}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})


export function mergeOptions (parent,child) {
  const options = {}

  for(let key in parent) {
    mergeField(key)
  }

  for(let key in child) {
    if(!parent.hasOwnProperty(key)) {
        mergeField(key)
    }
  }
  // 默认的合并策略，但是有些属性需要有特殊的合并方式  比如需要对生命周期进行一个特殊的拦截
  function mergeField (key) {
    if(strats[key]) {
      return (
        options[key] = strats[key](parent[key],child[key])
      )
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key], ...child[key]
      }
    } else if (child[key] === null) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }
  return options
}
export function proxy (vm,data,key) {
  Object.defineProperty(vm,key, {
    get () {
      return vm[data][key]
    },
    set (newValue) {
      vm[data][key] = newValue
    }
  })
}
export function defineProperty (target,key,value) {
  Object.defineProperty(target,key,{
    enumerable: false,
    configurable: false,
    value
  })
}
