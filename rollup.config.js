import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'packages/vue/src/index.ts',
    output: [
      {
        sourcemap: true,
        // 导出文件地址
        file: './packages/vue/dist/vue.js',
        format: 'iife',
        // 变量名
        name: 'Vue'
      }
    ],
    plugins: [
      typescript({
        sourceMap: true,
      }),
      // 模块导入的路径补全
      resolve(),
      // 转commonjs为esm
      commonjs()
    ]
  }
]