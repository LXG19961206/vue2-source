// 拿到数组上原型上的方法
let oldArrayProtoMethods = Array.prototype

//
export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
  'push','pop','reserve','unshift','sort','splice','shift'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // 当我们调用数组我们劫持的这 7 个方法，页面应该更新
    const result = oldArrayProtoMethods[method].apply(this, args)
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2);
      default:
        break
    }
    if(inserted) {
      this.__ob__.observeArray(this)
    }

    this.__ob__.dep.notify() // 通知数组更新
    return result
  }
})

