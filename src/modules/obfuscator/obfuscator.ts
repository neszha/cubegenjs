import fs from 'fs'
import JavaScriptObfuscator, { type ObfuscatorOptions } from 'javascript-obfuscator'
import { CubegenObfuscatorTarget } from './types/obfuscator.enum'
import nodeObfuscatorConfig from './configs/obfuscator.node-config'
import browserObfuscatorConfig from './configs/obfuscator.browser-config'

/**
 * Core class for obfuscate JavaScript source code.
 */
class CubegenObfuscator {
    sourceCode: string
    private inputOptions: ObfuscatorOptions

    constructor (sourceCode: string, target: CubegenObfuscatorTarget) {
        this.sourceCode = sourceCode

        // load default config options.
        this.inputOptions = (target === CubegenObfuscatorTarget.NODE) ? nodeObfuscatorConfig : browserObfuscatorConfig
    }

    /**
     * Set new config or custom options.
     *
     * @param configOptions
     */
    setCustomConfig (configOptions: ObfuscatorOptions): void {
        this.inputOptions = {
            ...configOptions,
            ...this.inputOptions
        }
    }

    /**
     * Execute source code with onfuscator tool.
     *
     * @param saveToPath string
     * @returns string
     */
    obfuscate (saveToPath?: string): string {
        const obfuscation = JavaScriptObfuscator.obfuscate(this.sourceCode, this.inputOptions)
        const outputCode = obfuscation.getObfuscatedCode()
        if (saveToPath) fs.writeFileSync(saveToPath, outputCode)
        return outputCode
    }
}

export default CubegenObfuscator
