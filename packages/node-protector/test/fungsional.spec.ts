import fs from 'fs'
import path from 'path'
import { CubegenBundler } from '@cubegenjs/bundler'
import { CubegenObfuscator } from '@cubegenjs/obfuscator'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type NodeProtectorModifiedCodeOptions, type NodeProtectorIntervalCallOptions } from './interfaces/NodeProtector'
import state from '../src/state'

describe('Test Functional Node Protector Module', () => {
    it('Success run onStart callback lifecycle', async () => {
        const nodeProtector = await import('../src/index.js')
        let isCalled = false
        nodeProtector.onStart(() => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 500)
    })

    it('Success run onModifiedCode callback lifecycle', async () => {
        const nodeProtector = await import('../src/index.js')
        state.inDevelopmentMode = 'distributed'
        const inputOptions: NodeProtectorModifiedCodeOptions = {
            enabled: true
        }
        let isCalled = false
        nodeProtector.onModifiedCode(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 500)
    })

    it('onModifiedCode not called if not enabled', async () => {
        const nodeProtector = await import('../src/index.js')
        const inputOptions: NodeProtectorModifiedCodeOptions = {
            enabled: false
        }
        let isCalled = false
        nodeProtector.onModifiedCode(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(false)
        }, 500)
    })

    it('onModifiedCode not called in development project', async () => {
        const nodeProtector = await import('../src/index.js')
        state.inDevelopmentMode = 'development'
        const inputOptions: NodeProtectorModifiedCodeOptions = {
            enabled: true
        }
        let isCalled = false
        nodeProtector.onModifiedCode(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(false)
        }, 500)
    })

    it('Success run onIntervalCall callback lifecycle', async () => {
        const nodeProtector = await import('../src/index.js')
        const inputOptions: NodeProtectorIntervalCallOptions = {
            enabled: true,
            eventLoopInterval: 200
        }
        let callCounter: number = 0
        nodeProtector.onIntervalCall(inputOptions, () => {
            callCounter++
        })
        setTimeout(() => {
            if (state.callIntervalTimeout !== null) {
                clearInterval(state.callIntervalTimeout)
            }
            expect(callCounter).toBeGreaterThanOrEqual(4)
        }, 1000)
    })

    it('onIntervalCall not called if not enabled', async () => {
        const nodeProtector = await import('../src/index.js')
        const inputOptions: NodeProtectorIntervalCallOptions = {
            enabled: false,
            eventLoopInterval: 200
        }
        let callCounter: number = 0
        nodeProtector.onIntervalCall(inputOptions, () => {
            callCounter++
        })
        setTimeout(() => {
            if (state.callIntervalTimeout !== null) {
                clearInterval(state.callIntervalTimeout)
            }
            expect(callCounter).toBe(0)
        }, 1000)
    })
})

describe('Test Obfuscate Node Protector Script', () => {
    const __dirname = path.join(process.cwd(), 'packages', 'node-protector', 'test')
    const bundlePath = path.join(__dirname, '.temp', 'index.js')
    const obfusPath = path.join(__dirname, '.temp', 'obfus.js')

    beforeAll(async () => {
        // Bundle node protector.
        const bundlerOptions: CubegenBundlerOptions = {
            rootDir: path.resolve(__dirname, '../src'),
            outDir: path.resolve(__dirname, '.temp'),
            entries: [
                'index.ts'
            ],
            includeNodeModules: true
        }
        const bundler = new CubegenBundler(bundlerOptions)
        await bundler.build()

        // Obfuscate node protector script.
        const obfuscator = new CubegenObfuscator(bundlePath)
        obfuscator.setCustomConfig({
            seed: 'seed-01'
        })
        const obfusResult = obfuscator.transform()
        fs.writeFileSync(obfusPath, obfusResult.outputCode, 'utf8')

        // Generate package.json
        const packageJsonPath = path.join(__dirname, '.temp', 'package.json')
        const packageJson = {
            name: 'test',
            type: 'module'
        }
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')
    })

    it('Success bundle node protector script', async () => {
        expect(fs.existsSync(bundlePath)).toBe(true)
    })

    it('Success obfuscate node protector script', async () => {
        expect(fs.existsSync(obfusPath)).toBe(true)
    })
})
