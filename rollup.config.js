import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js', //以这个入口来打包库
  output: {
    format: 'umd', //表示一个模块化的类型
    name: 'Vue', // 输出的全局变量的名字
    file: 'dist/umd/vue.js',
    sourceMap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({ //打开的浏览器是 3000 端口
      port: 3000,
      contentBase: '',
      openPage: '/watch.html'
    })
  ]
}
