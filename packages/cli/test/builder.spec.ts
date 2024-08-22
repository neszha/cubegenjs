// import path from 'path'
import builder from '../src/commands/builder'
// import { NodeBuilder } from '../src/utils/NodeBuilder'
// import { type NodeProtectorBuilderOptions } from './interfaces/NodeProtector'

// const MODULE_PATH_DIR = path.resolve(process.cwd(), 'packages/cli')

describe('Test Build Node Project', () => {
    // const projectDirectory = path.join(MODULE_PATH_DIR, 'test/examples/node-sample')

    it('Success build node project', async () => {
        await builder.build({
            root: './packages/cli/test/examples/node-sample'
        })
        expect(true).toBe(true)
    })
})
