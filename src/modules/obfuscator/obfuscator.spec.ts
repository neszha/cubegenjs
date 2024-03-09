import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import CubegenObfuscator from './obfuscator'
import { CubegenObfuscatorTarget } from './types/obfuscator.enum'

const ROOT_PATH = process.cwd()
const CUBEGEN_TEMP = path.resolve(ROOT_PATH, '.cubegen')

describe('Test Obfucation Module for Node: hello-word.test-template.js', () => {
    let sourceCode: string = ''
    const templatePath = path.resolve(ROOT_PATH, 'src/modules/obfuscator/templates/hello-word.test-template.js')

    beforeAll(() => {
        if (!fs.existsSync(CUBEGEN_TEMP)) fs.mkdirSync(CUBEGEN_TEMP)
        sourceCode = fs.readFileSync(templatePath, 'utf8')
    })

    it('Success obfuscate source code with default config.', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode = obfuscator.obfuscate()
        expect(sourceCode).not.toEqual(outputCode)
    })

    it('Obfuscator successful to hide "Hello" or "World" string.', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode = obfuscator.obfuscate()
        expect(outputCode).not.toContain('Hello')
        expect(outputCode).not.toContain('World')
    })

    it('Obfuscator with default config always get unique output', () => {
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        const outputCode1 = obfuscator.obfuscate()
        const outputCode2 = obfuscator.obfuscate()
        const outputCode3 = obfuscator.obfuscate()
        expect(outputCode1).not.toEqual(outputCode2)
        expect(outputCode1).not.toEqual(outputCode3)
        expect(outputCode2).not.toEqual(outputCode3)
    })

    it('Obfuscator output code can be run with JavaScript engine', () => {
        const outputPath = path.resolve(CUBEGEN_TEMP, 'output-from-test.js')
        const obfuscator = new CubegenObfuscator(sourceCode, CubegenObfuscatorTarget.NODE)
        obfuscator.obfuscate(outputPath)

        // compare exec ouputs.
        const output1 = execSync(`node ${templatePath}`, { encoding: 'utf-8' })
        const output2 = execSync(`node ${outputPath}`, { encoding: 'utf-8' })
        expect(output1).toEqual(output2)
    })
})
