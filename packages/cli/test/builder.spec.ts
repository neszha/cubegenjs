import path from 'path'
import fs from 'fs-extra'
import builder from '../src/commands/build'

describe('Test Build Node Project', () => {
    it('Success build node project', async () => {
        const rootProject = './packages/cli/test/examples/node-sample'
        const hashOuputProject = 'sha256:90be3fdd744e614b3b919826efb1d3a8f451716ed3ab48dabffb5b27a4f0431d'
        await builder.build({
            root: rootProject
        })

        // Output project not change integrity (hash).
        const cubegenLockJsonPath = path.join(rootProject, 'dist', 'cubegen-lock.json')
        const cubegenLockJsonString = fs.readFileSync(cubegenLockJsonPath, 'utf-8')
        const cubegenLockJson = JSON.parse(cubegenLockJsonString)
        expect(cubegenLockJson.hashProject).toBe(hashOuputProject)
    }, 15_000)

    it('Success build web project', async () => {
        const rootProject = './packages/cli/test/examples/web-sample'
        await builder.build({
            root: rootProject
        })
        expect(true).toBe(true)
    }, 15_000)
})
