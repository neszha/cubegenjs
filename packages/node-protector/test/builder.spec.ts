import path from 'path'
import { NodeBuilder } from '../src/utils/NodeBuilder'

const MODULE_PATH_DIR = path.resolve(process.cwd(), 'packages/node-protector')

describe('Test Node Protector Module: example-01', () => {
    const projectDirectory = path.join(MODULE_PATH_DIR, 'test/example-01')

    it('xx', async () => {
        const nodeBuilder = new NodeBuilder({
            rootDir: projectDirectory
        })
        await nodeBuilder.build()
        expect(true).toBe(true)
    })
})
