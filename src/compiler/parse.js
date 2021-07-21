export function parseHTML (html) {
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
  // 用于匹配命名空间
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  // 开头标签
  const startTagOpen = new RegExp(`^<${qnameCapture}`)
  // 结束标签
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
  // 属性匹配
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
  const startTagClose = /^\s*(\/?)>/;
  // 匹配 {{  }}
  let root;
  let currentParent;
  let stack = [];

  function start(tagName,attrs) { 
    let element = createASTElement(tagName, attrs)
    if(!root) {
      root = element
    }
    currentParent = element // 当前解析的标签 保存起来
    stack.push(element)
  }

  function end (tagName) { // 在结尾标签处,创建父子关系
    let element = stack.pop()
    // 取出栈中的最后一个
    currentParent = stack[stack.length - 1]
    if(currentParent) { // 在闭合时候可以知道这个标签的父亲是谁
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars (text) {
    text = text.trim()
    if(text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  function createASTElement (tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

  while (html) {
    // 只要 html 不为空字符串,就一直解析下去
    let textEnd = html.indexOf('<')
    if(textEnd === 0) {
      // 肯定是标签
      const startTagMatch = parseStartTag();
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text;
    if(textEnd > 0) {// 是文本
      text = html.substring(0, textEnd)
    }
    if(text) {
      advance(text.length)
      chars(text)
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if(start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length); //删除开始标签
      // 如果直接是 闭合标签了,说明没有属性
      let end,attr
      // 不是结尾标签,也能匹配到属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length)
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  return root
}