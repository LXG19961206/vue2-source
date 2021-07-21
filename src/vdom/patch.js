export function patch (oldVnode, vnode) {
    // 默认初始化时候，使用虚拟节点创建出真实节点，替换掉老节点
    // 如果oldVnode 是一个真实 dom
    if(oldVnode.nodeType === 1) { // 代表是一个真实节点
      // 将虚拟节点转换为真实节点
      console.log(oldVnode,vnode)
      // 产生真实 dom
      let el = createElm(vnode)
      // 获取老的 app 的父亲元素
      let parentELm = oldVnode.parentNode;
      // 将真实元素插入到 app 的后面
      parentELm.insertBefore(el, oldVnode.nextSibling)
      parentELm.removeChild(oldVnode);
      return el
    } else {
      // 在更新时候，使用老的虚拟节点 和新的虚拟节点做对比， 将不同的地方更新到真实 dom 上
      // 既有渲染功能又有更新功能
      // 用新的虚拟节点 对比 老的虚拟节点， 找到差异， 去最少程度地更新dom

      // diff的核心是同级比较
      // 1. 比较两个元素的标签，如果标签不同，直接替换掉即可
      if(oldVnode.tag !== vnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
      }
      // 2.有种可能是标签一样, 文本节点的虚拟节点 tag 都是 undefined
      if(!oldVnode.tag) { // 文本的对比
        if(oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text
        }
      }
      // 3.标签一样，需要对比 标签的 属性 和 children
      let el = vnode.el = oldVnode.el  // 复用节点
      // 更新属性，用新的虚拟节点的属性和老的比较去更新即可
      updateProperties(vnode, oldVnode.data)

      // 比较儿子
      let oldChildren = oldVnode.children || []
      let newChildren = vnode.children || []
      // -> 老的有儿子，新的也有儿子 diff 算法
      if(oldChildren.length && newChildren.length) {
        updateChild(oldChildren, newChildren, oldVnode.el)
      } else if (oldChildren.length) {
        // -> 老的有儿子，新的没儿子
        el.innerHTML = ''
      } else if (newChildren.length) {
        // -> 老的没儿子，新的有儿子
        for(let i = 0 ; i < newChildren.length ; i ++) {
          let child = newChildren[i]
          el.appendChild(createElm(child))
        }
      }
    }
}
// 判断两者是否是相同的节点
function isSameVnode (oldVnode,newVnode) {
  // 只要标签以及 key 值相同，两者就是同一个元素
  return (
    oldVnode.tag === newVnode.tag
  ) && (
    oldVnode.key === newVnode.key
  )
}
// 儿子间的比较
function updateChild (oldChildren, newChildren, parent) {
  let oldStartIndex = 0,
      oldStartVnode = oldChildren[0],
      oldEndIndex = oldChildren.length -1,
      oldEndVnode = oldChildren[oldChildren.length -1]

  let newStartIndex = 0,
      newStartVnode = newChildren[0],
      newEndIndex = newChildren.length -1,
      newEndVnode = newChildren[newChildren.length -1]

  // vue 的中的 diff 算法做了很多的 优化
  // DOM 中的操作有很多常见的逻辑 ： 把节点插入到当前儿子的 头、尾
  // vue2 中采用了双指针的方式
  // 在尾部添加

  // 创建一个循环，同时循环 老的和新的，哪个先循环完就退出循环，将多余的添加或者删除
  // 比较谁先循环完
  function makeIndexByKey (children) {
    let map = {}
    children.forEach((item,index) => {
      item.key && (map[item.key] = index)
    })
  }
  let map = makeIndexByKey(oldChildren)
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if(!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartVnode]
    } else if(!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex]
      // oldStartVnode newStartVnode 如果是两者是同一个节点，那么比较他们的 children
    } else if(isSameVnode(oldStartVnode,newStartVnode)) { // 如果两者是同一个元素，对比
      patch(oldStartVnode, newStartVnode) // 更新属性和 再去递归更新子节点
      // diff 完成后， 移动指针
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      patch(oldEndVnode,newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
      // 如果老的头和新的尾是同一个
    } else if(isSameVnode(oldStartVnode, newEndVnode)) {
      // 反转了节点
      // -> 头部移动到了尾部
      // -> 尾部移动到了头部
      patch(oldStartVnode, newEndVnode)
      // 将当前元素放到 尾部下一个元素的前面去
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if(isSameVnode(oldEndVnode, newStartVnode)) {
      // 反转了节点
      // -> 头部移动到了尾部
      // -> 尾部移动到了头部
      patch(oldEndVnode, newStartVnode)
      // 将当前元素放到 尾部下一个元素的前面去
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 儿子之间没有直接的关系， 进行暴力对比
      let moveIndex = map[newStartVnode.key] // 拿到开头的虚拟节点，去老的节点中找，看看有没有
      if(moveIndex == undefined) {
        // 说明新元素不再老节点中
        parent.insertBefore(createElm(newStartVnode),oldStartVnode.el)
      } else {
        let moveVNode = oldChildren // 这个老的虚拟节点需要移动
        oldChildren[moveIndex] = null
        parent.insertBefore(moveVNode.el, oldStartVnode.el)
        patch(moveVNode.el, newStartVnode) // 比较属性和儿子
      }
      newStartVnode = newChildren[++newStartIndex]  // 用新的不停地去老的里面找
    }
  }
  if(newStartIndex <= newEndIndex){
    // 此时开始和结束指针重合
    // 将新的多余的部分插入即可
    // 但是有可能是向前添加，也有可能是向后添加
    for(let i = newStartIndex ; i <= newEndIndex; i ++) {
      let ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
      parent.insertBefore(createElm(newChildren[i]), ele)
    }
  }
  // 如果老节点多，删去多余内容
  if(oldStartIndex <= oldEndIndex) {
    for(let i = oldStartIndex ; i <= oldEndIndex; i ++) {
      let child = oldChildren[i]
      if(child != undefined) {
        parent.removeChild(child.el)
      }
    }
  }
}

export function createElm (vnode) {
    let { tag, children, key, data, text } = vnode
    if(typeof tag == 'string') {
        // 创建元素放在 vnode.el 上面
        vnode.el = document.createElement(tag)
        // 遍历儿子，将渲染后的结果放在父节点上
        updateProperties(vnode)
        children.forEach(child => {
            vnode.el.appendChild(
                createElm(child)
            )
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function handleStlyeStrToObject (style) {
  if(!style) return
  let obj = {}
  style.split(';').forEach(item => {
    let [key,value] = item.split(':')
    obj[key] = value
  })
  return obj
}
// vue渲染流程
// - 初始化数据
// - 将模版编译为 render 函数
// - 生成虚拟节点
// - 根据虚拟节点 生成新的 DOM
// - 扔到 真实 DOM 上
function updateProperties(vnode, oldProps = {}) {
    let { el } = vnode
    let newProps = vnode.data || {}
    // 老的有新的没有，需要删除属性
    for(let key in oldProps) {
      if(!newProps[key]) {
        // 移除真实 dom 的属性
        el.removeAttribute(key)
      }
    }
    try {
      let newStyle = JSON.parse(newProps['style']) || {}
      let oldStyle = JSON.parse(oldProps['style'])  || {}

      // 老的有，新的没有，直接删除老的即可
      for(let key in oldStyle) {
        if(!newStyle[key]) {
          el.style[key] = ''
        }
      }
      // 新的有， 直接用新的去做更新即可
    } catch (err) {

    }
    for(let key in newProps) {
        switch (key) {
            case 'style':
                let styleObject = JSON.parse(newProps[key])
                for( let css in styleObject) {
                  el.style[css] = styleObject[css]
                }
                break
            case 'class':
                el.className = newProps.class
                break
            default:
                el.setAttribute(key, newProps[key])
                break
        }
    }
}
