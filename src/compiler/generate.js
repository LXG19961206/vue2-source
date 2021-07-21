const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function generate (ast) {
  // 语法层面的转译
  let children = getChildren(ast)
  return `_c('${ast.tag}',${ast.attrs.length ? '{' + genProps(ast.attrs) + '}' : 'undefined'},${
    children ? children : ''
  })`

}

function genProps (attrs) {
  let str = ''
  for(let i = 0 ; i < attrs.length ; i++) {
    let attr = attrs[i]
    if(attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key,value] = item.split(':')
        obj[key] = value
      });
      attr.value = JSON.stringify(obj)
    }
    str += `${attr.name}:'${attr.value}',`
  }
  return str.slice(0,-1).toString()
}

// 将所有转换后的 儿子 用逗号拼接起来
function gen(node) {
  if(node.type === 1){
    // 生成元素节点的字符串
    return generate(node)
  } else {
    let { text } = node
    // 如果是普通文本
    if(!defaultTagRE.test(text)) {
      // 如果是带有变量 {{  }} 的文本
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = []
    // 如果正则是全局模式,需要每次使用前置为0,否则可能会匹配不到
    let lastIndex = defaultTagRE.lastIndex = 0;

    let match,index; //每次匹配到的结果
    while (match = defaultTagRE.exec(text)) {
      index = match.index
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${ match[1] ? match[1].trim() : ''})`)
      lastIndex = index + match[0].length
    }
    if(lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}

function getChildren (el) {
  const children = el.children
  if(children) {
    return children.map(child => gen(child) + ',').join('').slice(0,-1)
  }
}

