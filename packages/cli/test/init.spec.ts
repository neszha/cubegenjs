import fs from 'fs'
import path from 'path'
import { type WebProtectorBuilderOptions } from '@cubegenjs/web-protector/src/interfaces/WebProtector'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/src/interfaces/NodeProtector'
import initor from '../src/commands/init'

describe('Test Init Node Protector Project', () => {
    it('Success init cubegen node protector', async () => {
        const projectDir = path.join(process.cwd(), 'packages/cli/test/examples/init-node-sample')

        // Clear old config.
        const builderPath = path.join(projectDir, 'cg.builder.js')
        const protectorPath = path.join(projectDir, 'cg.protector.js')
        fs.rmSync(builderPath, { force: true })
        fs.rmSync(protectorPath, { force: true })

        // Generate cubegen config.
        await initor.generate({
            root: './packages/cli/test/examples/init-node-sample',
            userInput: {
                targetEnvironment: 'node'
            }
        })

        // Check builder config property.
        const builderDefault = await import(builderPath)
        const builder = builderDefault.default as NodeProtectorBuilderOptions
        expect(builder.appKey).toBeTruthy()
        expect(builder.target).toBe('node')
        expect(builder.codeBundlingOptions).toBeTruthy()
        expect(builder.codeObfuscationOptions).toBeDefined()
        expect(builder.codeObfuscationOptions.target).toBe('node')

        // Cehck protector config property.
        const protectorDefault = await import(protectorPath)
        const protector = protectorDefault.builderDefault
        expect(protector).toBeUndefined()
    }, 15_000)

    it('Success init cubegen web protector', async () => {
        const projectDir = path.join(process.cwd(), 'packages/cli/test/examples/init-web-sample')

        // Clear old config.
        const builderPath = path.join(projectDir, 'cg.builder.js')
        const protectorPath = path.join(projectDir, 'cg.protector.js')
        fs.rmSync(builderPath, { force: true })
        fs.rmSync(protectorPath, { force: true })

        // Generate cubegen config.
        await initor.generate({
            root: './packages/cli/test/examples/init-web-sample',
            userInput: {
                targetEnvironment: 'browser'
            }
        })

        // Check builder config property.
        const builderDefault = await import(builderPath)
        const builder = builderDefault.default as WebProtectorBuilderOptions
        expect(builder.appKey).toBeTruthy()
        expect(builder.target).toBe('browser')
        expect(builder.buildCommand).toBe('npm run build')
        expect(builder.codeObfuscationOptions).toBeDefined()
        expect(builder.codeObfuscationOptions.target).toBe('browser')
    }, 15_000)
})
