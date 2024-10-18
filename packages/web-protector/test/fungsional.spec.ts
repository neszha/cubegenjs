import fs from 'fs'
import path from 'path'
import { CubegenBundler } from '@cubegenjs/bundler'
import { CubegenObfuscator } from '@cubegenjs/obfuscator'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler.js'
import { type WebProtectorIntervalCallOptions, type WebProtectorDomainLockingOptions } from './interfaces/WebProtector.js'

describe('Test Functional Web Protector Module', () => {
    it('Success run onStart callback lifecycle', async () => {
        const webProtector = await import('../src/index.js')
        let isCalled = false
        webProtector.onStart(() => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 500)
    })

    it('Success run onDocumentLoaded callback lifecycle', async () => {
        const webProtector = await import('../src/index.js')
        let isCalled = false
        webProtector.onDocumentLoaded(() => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 500)
    })

    it('onDomainNotAllowed called if site host is not in whitlist', async () => {
        const webProtector = await import('../src/index.js')
        let isCalled = false
        webProtector.customState.inDevelopmentMode = 'distributed'
        webProtector.customState.siteHost = 'example.com'
        const inputOptions: WebProtectorDomainLockingOptions = {
            enabled: true,
            whitlist: [
                // 'example.com',
                'example1.com',
                'example2.com',
                '/example3.com/i'
            ]
        }
        webProtector.onDomainNotAllowed(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 1000)
    })

    it('onDomainNotAllowed not called if not enabled', async () => {
        const webProtector = await import('../src/index.js')
        const inputOptions: WebProtectorDomainLockingOptions = {
            enabled: false,
            whitlist: []
        }
        let isCalled = false
        webProtector.onDomainNotAllowed(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(false)
        }, 500)
    })

    it('onDomainNotAllowed not called in development project', async () => {
        const webProtector = await import('../src/index.js')
        webProtector.customState.inDevelopmentMode = 'development'
        const inputOptions: WebProtectorDomainLockingOptions = {
            enabled: true,
            whitlist: []
        }
        let isCalled = false
        webProtector.onDomainNotAllowed(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(false)
        }, 500)
    })

    it('Success run onIntervalCall callback lifecycle', async () => {
        const nodeProtector = await import('../src/index.js')
        const inputOptions: WebProtectorIntervalCallOptions = {
            enabled: true,
            eventLoopInterval: 200
        }
        let callCounter: number = 0
        nodeProtector.onIntervalCall(inputOptions, () => {
            callCounter++
        })
        setTimeout(() => {
            if (nodeProtector.customState.callIntervalTimeout !== null) {
                clearInterval(nodeProtector.customState.callIntervalTimeout)
            }
            expect(callCounter).toBeGreaterThanOrEqual(3)
        }, 1000)
    })

    it('onIntervalCall not called if not enabled', async () => {
        const nodeProtector = await import('../src/index.js')
        const inputOptions: WebProtectorIntervalCallOptions = {
            enabled: false,
            eventLoopInterval: 200
        }
        let callCounter: number = 0
        nodeProtector.onIntervalCall(inputOptions, () => {
            callCounter++
        })
        setTimeout(() => {
            if (nodeProtector.customState.callIntervalTimeout !== null) {
                clearInterval(nodeProtector.customState.callIntervalTimeout)
            }
            expect(callCounter).toBe(0)
        }, 1000)
    })
})

describe('Test Obfuscate Web Protector Script', () => {
    const __dirname = path.join(process.cwd(), 'packages', 'web-protector', 'test')
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
