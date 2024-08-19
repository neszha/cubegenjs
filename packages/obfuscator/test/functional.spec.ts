import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenObfuscator } from '../src/index'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const sampleTestMd5Path = path.join(MODULE_PATH_DIR, 'test/examples/md5.sample-test.js')
const sampleTestHelloWordPath = path.join(MODULE_PATH_DIR, 'test/examples/hello-word.sample-test.js')

describe('Test Class Cubegen Obfuscator Module', () => {
    it('Success initialize obfuscator class', () => {
        const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
        expect(obfuscator).toHaveProperty('sourceCodePath')
        expect(obfuscator).toHaveProperty('inputOptions')
        expect(obfuscator).toHaveProperty('setCustomConfig')
        expect(obfuscator).toHaveProperty('transform')
    })

    it('Success custom obfuscator config options', () => {
        const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
        const originalConfigOptions = obfuscator.getConfig()
        obfuscator.setCustomConfig({
            seed: 'custom-seed',
            target: 'browser',
            compact: false
        })
        const newConfigOptions = obfuscator.getConfig()
        expect(originalConfigOptions).not.toEqual(newConfigOptions)
    })

    it('Success tranform javascript code to obfuscated code', () => {
        const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
        obfuscator.setCustomConfig({
            seed: 'seed-01'
        })
        const result = obfuscator.transform()

        // Check response properties.
        expect(result).toHaveProperty('hash')
        expect(result).toHaveProperty('outputTempPath')
        expect(result).toHaveProperty('outputCode')
        expect(result.hash).toContain('sha256:')

        // Check save file in temporary path.
        expect(fs.existsSync(result.outputTempPath)).toBe(true)
    })
})

describe('Test Functional Obfuscator Module', () => {
    describe('Test obfucation with code file hello-word.sample-test.js', () => {
        it('Obfuscator successful to hide "Hello" & "World" & remove comment string', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
            const result = obfuscator.transform()

            // Check contain text.
            expect(result.outputCode).not.toContain('Hello')
            expect(result.outputCode).not.toContain('World')
            expect(result.outputCode).not.toContain('This')
            expect(result.outputCode).not.toContain('program.')
        })

        it('Obfuscator with default config always get unique output code', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
            const result1 = obfuscator.transform()
            const result2 = obfuscator.transform()
            const result3 = obfuscator.transform()

            // Compare hash output.
            expect(result1.hash).not.toEqual(result2.hash)
            expect(result1.hash).not.toEqual(result3.hash)
            expect(result2.hash).not.toEqual(result3.hash)
        })

        it('Obfuscator with static seed get not unique output code', () => {
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
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
            const obfuscator = new CubegenObfuscator(sampleTestHelloWordPath)
            const result = obfuscator.transform()

            // Compare exec ouputs.
            const output1 = execSync(`node ${sampleTestHelloWordPath}`, { encoding: 'utf-8' })
            const output2 = execSync(`node ${result.outputTempPath}`, { encoding: 'utf-8' })
            expect(output1).toEqual(output2)
        })
    })

    describe('Test obfucation with code file md5.sample-test.js', () => {
        it('Obfuscator output code can be run with JavaScript engine', () => {
            const obfuscator = new CubegenObfuscator(sampleTestMd5Path)
            const result = obfuscator.transform()

            // Compare exec hash output with string "test_string".
            const md5HashFromSourceCode = execSync(`node ${sampleTestMd5Path}`, { encoding: 'utf-8' })
            const md5HashFromOutputCode = execSync(`node ${result.outputTempPath}`, { encoding: 'utf-8' })
            expect(md5HashFromSourceCode).toEqual(md5HashFromOutputCode)
        })
    })
})
