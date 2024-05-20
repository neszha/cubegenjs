import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenObfuscator } from '../src/index'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const sampleTestMd5Path = path.join(MODULE_PATH_DIR, 'test/examples/md5.sample-test.js')
const sampleTestHelloWordPath = path.join(MODULE_PATH_DIR, 'test/examples/hello-word.sample-test.js')

describe('Test Functional Obfuscator Module: Node Environment', () => {
    describe('Test Obfucation with file hello-word.sample-test.js', () => {
        it('Success obfuscate source code with default config', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'node')
            const result = obfuscator.transform()

            // check response properties.
            expect(result).toHaveProperty('hash')
            expect(result).toHaveProperty('outputTempPath')
            expect(result).toHaveProperty('outputCode')

            // check save file in temporary path.
            expect(fs.existsSync(result.outputTempPath)).toBe(true)
        })

        it('Obfuscator successful to hide "Hello" & "World" & remove comment string', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'node')
            const result = obfuscator.transform()

            // check contain text
            expect(result.outputCode).not.toContain('Hello')
            expect(result.outputCode).not.toContain('World')
            expect(result.outputCode).not.toContain('This')
            expect(result.outputCode).not.toContain('program.')
        })

        it('Obfuscator with default config always get unique output code', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'node')
            const result1 = obfuscator.transform()
            const result2 = obfuscator.transform()
            const result3 = obfuscator.transform()

            // Compare hash output.
            expect(result1.hash).not.toEqual(result2.hash)
            expect(result1.hash).not.toEqual(result3.hash)
            expect(result2.hash).not.toEqual(result3.hash)
        })

        it('Obfuscator with static seed get not unique output code', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'node')
            obfuscator.setCustomConfig({
                seed: 'static-seed'
            })
            const result1 = obfuscator.transform()
            const result2 = obfuscator.transform()
            const result3 = obfuscator.transform()

            // Compare hash output.
            expect(result1.hash).toEqual(result2.hash)
            expect(result1.hash).toEqual(result3.hash)
            expect(result2.hash).toEqual(result3.hash)
        })

        it('Obfuscator output code can be run with JavaScript engine', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'node')
            const result = obfuscator.transform()

            // compare exec ouputs.
            const output1 = execSync(`node ${sampleTestHelloWordPath}`, { encoding: 'utf-8' })
            const output2 = execSync(`node ${result.outputTempPath}`, { encoding: 'utf-8' })
            expect(output1).toEqual(output2)
        })
    })

    describe('Test Obfucation with file md5.sample-test.js', () => {
        it('Success obfuscate source code with default config', () => {
            const obfuscator = new CubegenObfuscator(sampleTestMd5Path, 'node')
            const result = obfuscator.transform()

            // check response properties.
            expect(result).toHaveProperty('hash')
            expect(result).toHaveProperty('outputTempPath')
            expect(result).toHaveProperty('outputCode')

            // check save file in temporary path.
            expect(fs.existsSync(result.outputTempPath)).toBe(true)
        })

        it('Obfuscator output code can be run with JavaScript engine', () => {
            const obfuscator = new CubegenObfuscator(sampleTestMd5Path, 'node')
            const result = obfuscator.transform()

            // compare exec hash output with string "test_string".
            const md5HashFromSourceCode = execSync(`node ${sampleTestMd5Path}`, { encoding: 'utf-8' })
            const md5HashFromOutputCode = execSync(`node ${result.outputTempPath}`, { encoding: 'utf-8' })
            expect(md5HashFromSourceCode).toEqual(md5HashFromOutputCode)
        })
    })
})

describe('Test Functional Obfuscator Module: Browser Environment', () => {
    describe('Test Obfucation with file hello-word.sample-test.js', () => {
        it('Success obfuscate source code with default config', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'browser')
            const result = obfuscator.transform()

            // check response properties.
            expect(result).toHaveProperty('hash')
            expect(result).toHaveProperty('outputTempPath')
            expect(result).toHaveProperty('outputCode')

            // check save file in temporary path.
            expect(fs.existsSync(result.outputTempPath)).toBe(true)
        })

        it('Obfuscator successful to hide "Hello" & "World" & remove comment string', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'browser')
            const result = obfuscator.transform()

            // check contain text
            expect(result.outputCode).not.toContain('Hello')
            expect(result.outputCode).not.toContain('World')
            expect(result.outputCode).not.toContain('This')
            expect(result.outputCode).not.toContain('program.')
        })

        it('Obfuscator with default config always get unique output code', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'browser')
            const result1 = obfuscator.transform()
            const result2 = obfuscator.transform()
            const result3 = obfuscator.transform()

            // Compare hash output.
            expect(result1.hash).not.toEqual(result2.hash)
            expect(result1.hash).not.toEqual(result3.hash)
            expect(result2.hash).not.toEqual(result3.hash)
        })

        it('Obfuscator with static seed get not unique output code', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'browser')
            obfuscator.setCustomConfig({
                seed: 'static-seed'
            })
            const result1 = obfuscator.transform()
            const result2 = obfuscator.transform()
            const result3 = obfuscator.transform()

            // Compare hash output.
            expect(result1.hash).toEqual(result2.hash)
            expect(result1.hash).toEqual(result3.hash)
            expect(result2.hash).toEqual(result3.hash)
        })

        it('Obfuscator output code can be run with JavaScript engine', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath, 'browser')
            const result = obfuscator.transform()

            // compare exec ouputs.
            const output1 = execSync(`node ${sampleTestHelloWordPath}`, { encoding: 'utf-8' })
            const output2 = execSync(`node ${result.outputTempPath}`, { encoding: 'utf-8' })
            expect(output1).toEqual(output2)
        })
    })

    describe('Test Obfucation with file md5.sample-test.js', () => {
        it('Success obfuscate source code with default config', () => {
            const obfuscator = new CubegenObfuscator(sampleTestMd5Path, 'browser')
            const result = obfuscator.transform()

            // check response properties.
            expect(result).toHaveProperty('hash')
            expect(result).toHaveProperty('outputTempPath')
            expect(result).toHaveProperty('outputCode')

            // check save file in temporary path.
            expect(fs.existsSync(result.outputTempPath)).toBe(true)
        })

        it('Obfuscator output code can be run with JavaScript engine', () => {
            const obfuscator = new CubegenObfuscator(sampleTestMd5Path, 'browser')
            const result = obfuscator.transform()

            // compare exec hash output with string "test_string".
            const md5HashFromSourceCode = execSync(`node ${sampleTestMd5Path}`, { encoding: 'utf-8' })
            const md5HashFromOutputCode = execSync(`node ${result.outputTempPath}`, { encoding: 'utf-8' })
            expect(md5HashFromSourceCode).toEqual(md5HashFromOutputCode)
        })
    })
})
