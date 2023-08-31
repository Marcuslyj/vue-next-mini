import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default [{
  input: 'packages/vue/src/index.ts',
  output: [
    // 导出 iife 模式的包
    {
      sourcemap: true,
      file: 'packages/vue/dist/vue.js',
      format: 'iife',
      // 变量名
      name: 'Vue'
    }
  ],
  plugins: [
    typescript({ sourceMap: true }),
    // 模块导入的路径不全
    resolve(),
    // 转 commonjs 为 esm
    commonjs()
  ]
}]