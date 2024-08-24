import fs from 'fs'
import path from 'path'
import initor from '@cubegenjs/cli_test/src/commands/init'

const projectDir = path.join(process.cwd(), 'packages/cli/test/examples/init-node-sample')

describe('Test Init Node Protector Project', () => {
    it('Success init node protector', async () => {
        // Clear old config.
        const builderPath = path.join(projectDir, 'cg.builder.js')
        const protectorPath = path.join(projectDir, 'cg.protector.js')
        fs.rmSync(builderPath, { force: true })
        fs.rmSync(protectorPath, { force: true })

        // Init.
        await initor.generate({
            root: './packages/cli/test/examples/init-node-sample',
            userInput: {
                targetEnvironment: 'node'
            }
        })
        expect(true).toBe(true)
    }, 15_000)
})
