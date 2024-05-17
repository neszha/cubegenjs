import path from 'path'
import { type RollupOptions, rollup } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

const inputOptions: RollupOptions = {
    input: path.resolve(__dirname, '../test/examples/node-code/node.js'),
    plugins: [
        resolve(),
        commonjs()
    ]
}

void (async () => {
    const bundle = await rollup(inputOptions)
    await bundle.write({
        file: path.resolve(__dirname, './bundle.js'),
        format: 'cjs' // CommonJS format for Node.js
    })
})()
