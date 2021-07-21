import { parseHTML } from './parse'
import { generate } from './generate'

export function compileToFunctions (template) {
  // 将 html 模版 - render 函数
  // 1.需要将 html转换为 ”ast语法树“, 可以用 ast树 来描述语言
  // - ast 本身是用于描述代码的

  // 虚拟 DOM 是用对象来描述节点
  // 2.通过这棵树,重新地生成代码

  let ast = parseHTML(template)

  // 优化静态节点

  // 通过这棵树, 生成一个render 函数
  const code = generate(ast)
  // 通过 with 关键词 限制取值范围
  // 稍后调用 render 可以通过 with 改变内部结果
  return new Function(`with(this){return ${code}}`)
}





