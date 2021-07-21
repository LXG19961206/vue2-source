let id = 0
export default class Dep {
  constructor() {
    this.subs = []
    this.id = id++
  }
  addSub (watcher) {
    this.subs.push(watcher)
  }
  depend () {
    // 我们希望 watcher 也可以存放 dep, 让 dep 和 water 双向记忆
    Dep.target.addDep(this)
  }
  notify () {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}

Dep.target = null

let stack = [];

export function pushTarget (watcher) {
  Dep.target = watcher
  stack.push(watcher) // 渲染 watcher , 还有其他的watcher
}
export function popTarget () {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
// 多对多的关系， 一个属性有一个 dep 是用来收集 watcher 的
// dep 可以存放多个 watcher vm.$watch('name')
// 一个 watcher 可以对应多个 dep
