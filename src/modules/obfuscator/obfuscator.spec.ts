import fs from 'fs'
import path from 'path'
import { SHA256 } from 'crypto-js'
import { execSync } from 'child_process'
import CubegenObfuscator from './obfuscator'
import { CubegenObfuscatorTarget } from './types/obfuscator.enum'

const ROOT_PATH = process.cwd()
const CUBEGEN_TEMP = path.resolve(ROOT_PATH, '.cubegen')

describe('Test Obfucation Module for Node: hello-word.test-template.js', () => {
    let sourceCode: string = ''
    const sourceCodePath = path.resolve(ROOT_PATH, 'src/modules/obfuscator/templates/hello-word.test-template.js')

    beforeAll(() => {
        if (!fs.existsSync(CUBEGEN_TEMP)) fs.mkdirSync(CUBEGEN_TEMP)
        sourceCode = fs.readFileSync(sourceCodePath, 'utf8')
    })

    it('Success obfuscate source code with default config', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode = obfuscator.obfuscate()
        expect(sourceCode).not.toEqual(outputCode)
    })

    it('Obfuscator successful to hide "Hello" & "World" & remove comment string', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode = obfuscator.obfuscate()
        expect(outputCode).not.toContain('Hello')
        expect(outputCode).not.toContain('World')
        expect(outputCode).not.toContain('This')
        expect(outputCode).not.toContain('program.')
    })

    it('Obfuscator with default config always get unique output code', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode1 = obfuscator.obfuscate()
        const outputCode2 = obfuscator.obfuscate()
        const outputCode3 = obfuscator.obfuscate()

        // Create hash from otuputs.
        const hashOutput1 = SHA256(outputCode1).toString()
        const hashOutput2 = SHA256(outputCode2).toString()
        const hashOutput3 = SHA256(outputCode3).toString()

        // Compare hash output.
        expect(hashOutput1).not.toEqual(hashOutput2)
        expect(hashOutput1).not.toEqual(hashOutput3)
        expect(hashOutput2).not.toEqual(hashOutput3)
    })

    it('Obfuscator with static seed get not unique output code', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        obfuscator.setCustomConfig({
            seed: 'static-seed'
        })
        const outputCode1 = obfuscator.obfuscate()
        const outputCode2 = obfuscator.obfuscate()
        const outputCode3 = obfuscator.obfuscate()

        // Create hash from otuputs.
        const hashOutput1 = SHA256(outputCode1).toString()
        const hashOutput2 = SHA256(outputCode2).toString()
        const hashOutput3 = SHA256(outputCode3).toString()

        // Compare hash output.
        expect(hashOutput1).toEqual(hashOutput2)
        expect(hashOutput1).toEqual(hashOutput3)
        expect(hashOutput2).toEqual(hashOutput3)
    })

    it('Obfuscator output code can be run with JavaScript engine', () => {
        const outputPath = path.resolve(CUBEGEN_TEMP, 'hello-word.test-template.js')
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        obfuscator.obfuscate(outputPath)

        // compare exec ouputs.
        const output1 = execSync(`node ${sourceCodePath}`, { encoding: 'utf-8' })
        const output2 = execSync(`node ${outputPath}`, { encoding: 'utf-8' })
        expect(output1).toEqual(output2)
    })
})

describe('Test Obfucation Module for Browser: hello-word.test-template.js', () => {
    let sourceCode: string = ''
    const sourceCodePath = path.resolve(ROOT_PATH, 'src/modules/obfuscator/templates/hello-word.test-template.js')

    beforeAll(() => {
        if (!fs.existsSync(CUBEGEN_TEMP)) fs.mkdirSync(CUBEGEN_TEMP)
        sourceCode = fs.readFileSync(sourceCodePath, 'utf8')
    })

    it('Success obfuscate source code with default config', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        const outputCode = obfuscator.obfuscate()
        expect(sourceCode).not.toEqual(outputCode)
    })

    it('Obfuscator successful to hide "Hello" & "World" & remove comment string', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        const outputCode = obfuscator.obfuscate()
        expect(outputCode).not.toContain('Hello')
        expect(outputCode).not.toContain('World')
        expect(outputCode).not.toContain('This')
        expect(outputCode).not.toContain('program.')
    })

    it('Obfuscator with default config always get unique output code', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        const outputCode1 = obfuscator.obfuscate()
        const outputCode2 = obfuscator.obfuscate()
        const outputCode3 = obfuscator.obfuscate()

        // Create hash from otuputs.
        const hashOutput1 = SHA256(outputCode1).toString()
        const hashOutput2 = SHA256(outputCode2).toString()
        const hashOutput3 = SHA256(outputCode3).toString()

        // Compare hash output.
        expect(hashOutput1).not.toEqual(hashOutput2)
        expect(hashOutput1).not.toEqual(hashOutput3)
        expect(hashOutput2).not.toEqual(hashOutput3)
    })

    it('Obfuscator with static seed get not unique output code', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        obfuscator.setCustomConfig({
            seed: 'static-seed'
        })
        const outputCode1 = obfuscator.obfuscate()
        const outputCode2 = obfuscator.obfuscate()
        const outputCode3 = obfuscator.obfuscate()

        // Create hash from otuputs.
        const hashOutput1 = SHA256(outputCode1).toString()
        const hashOutput2 = SHA256(outputCode2).toString()
        const hashOutput3 = SHA256(outputCode3).toString()

        // Compare hash output.
        expect(hashOutput1).toEqual(hashOutput2)
        expect(hashOutput1).toEqual(hashOutput3)
        expect(hashOutput2).toEqual(hashOutput3)
    })

    it('Obfuscator output code can be run with JavaScript engine', () => {
        const outputPath = path.resolve(CUBEGEN_TEMP, 'hello-word.test-template.js')
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        obfuscator.obfuscate(outputPath)

        // compare exec ouputs.
        const output1 = execSync(`node ${sourceCodePath}`, { encoding: 'utf-8' })
        const output2 = execSync(`node ${outputPath}`, { encoding: 'utf-8' })
        expect(output1).toEqual(output2)
    })
})

describe('Test Obfucation Module for Node: md5.test-template.js', () => {
    let sourceCode: string = ''
    const sourceCodePath = path.resolve(ROOT_PATH, 'src/modules/obfuscator/templates/md5.test-template.js')

    beforeAll(() => {
        if (!fs.existsSync(CUBEGEN_TEMP)) fs.mkdirSync(CUBEGEN_TEMP)
        sourceCode = fs.readFileSync(sourceCodePath, 'utf8')
    })

    it('Success obfuscate source code with default config', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode = obfuscator.obfuscate()
        expect(sourceCode).not.toEqual(outputCode)
    })

    it('Obfuscator output code can be run with JavaScript engine', () => {
        const outputPath = path.resolve(CUBEGEN_TEMP, 'md5.test-template.js')
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        obfuscator.obfuscate(outputPath)

        // compare exec hash output with string "test_string".
        const md5HashFromSourceCode = execSync(`node ${sourceCodePath}`, { encoding: 'utf-8' })
        const md5HashFromOutputCode = execSync(`node ${outputPath}`, { encoding: 'utf-8' })
        expect(md5HashFromSourceCode).toEqual(md5HashFromOutputCode)
    })
})

describe('Test Obfucation Module for Browser: md5.test-template.js', () => {
    let sourceCode: string = ''
    const sourceCodePath = path.resolve(ROOT_PATH, 'src/modules/obfuscator/templates/md5.test-template.js')

    beforeAll(() => {
        if (!fs.existsSync(CUBEGEN_TEMP)) fs.mkdirSync(CUBEGEN_TEMP)
        sourceCode = fs.readFileSync(sourceCodePath, 'utf8')
    })

    it('Success obfuscate source code with default config', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        const outputCode = obfuscator.obfuscate()
        expect(sourceCode).not.toEqual(outputCode)
    })

    it('Obfuscator output code can be run with JavaScript engine', () => {
        const outputPath = path.resolve(CUBEGEN_TEMP, 'md5.test-template.js')
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.BROWSER)
        obfuscator.obfuscate(outputPath)

        // compare exec hash output with string "test_string".
        const md5HashFromSourceCode = execSync(`node ${sourceCodePath}`, { encoding: 'utf-8' })
        const md5HashFromOutputCode = execSync(`node ${outputPath}`, { encoding: 'utf-8' })
        expect(md5HashFromSourceCode).toEqual(md5HashFromOutputCode)
    })
})
