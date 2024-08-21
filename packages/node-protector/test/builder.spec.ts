import path from 'path'
import { NodeBuilder } from '../src/utils/NodeBuilder'
import { type NodeProtectorBuilderOptions } from './interfaces/NodeProtector'

const MODULE_PATH_DIR = path.resolve(process.cwd(), 'packages/node-protector')

describe('Test Node Protector Module: example-01', () => {
    const projectDirectory = path.join(MODULE_PATH_DIR, 'test/example-01')

    it('Success build project', async () => {
        // Get builder config.
        const builderConfigPath = path.join(projectDirectory, 'cg.builder.js')
        const builderConfigDefault = await import(builderConfigPath)
        const builderConfig = builderConfigDefault.default as NodeProtectorBuilderOptions

        // Build project.
        const nodeBuilder = new NodeBuilder({
            rootDir: projectDirectory,
            builderConfig
        })
        await nodeBuilder.build()
        expect(true).toBe(true)
    })
})
