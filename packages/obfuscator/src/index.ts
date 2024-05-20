import path from 'path'
import fs from 'fs-extra'
import { createHash } from 'crypto'
import JavaScriptObfuscator from 'javascript-obfuscator'
import obfuscatorDefaultConfig from './configs/obfuscator.default-config'
import { type ObfuscatorTargetEnvironment, type CubegenObfuscatorOptions, type CubegenObfuscatorResponse, type FilePath } from './types/Obfuscator'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_OBFUSCATOR_CACHE_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.obfuscator-cache')

/**
 * Core class for obfuscate JavaScript source code.
 */
export class CubegenObfuscator {
    sourceCodePath: FilePath
    private inputOptions: CubegenObfuscatorOptions

    constructor (sourceCodePath: FilePath, environmentTarget: ObfuscatorTargetEnvironment) {
        this.sourceCodePath = sourceCodePath

        // set default config options.
        this.inputOptions = {
            ...obfuscatorDefaultConfig,
            target: environmentTarget
        }

        // setup cache directory.
        if (!fs.existsSync(MODULE_OBFUSCATOR_CACHE_PATH_DIR)) fs.mkdirSync(MODULE_OBFUSCATOR_CACHE_PATH_DIR)
    }

    /**
     * Set new config or custom options.
     *
     * @param options
     */
    setCustomConfig (options: CubegenObfuscatorOptions): void {
        this.inputOptions = {
            ...this.inputOptions,
            ...options
        }
    }

    /**
     * Transform source code with obfuscator tool.
     *
     * @returns CubegenObfuscatorResponse
     */
    transform (): CubegenObfuscatorResponse {
        // read source code.
        const filename = path.basename(this.sourceCodePath)
        const sourceCode = fs.readFileSync(this.sourceCodePath, 'utf8')

        // run obfuscation.
        const obfuscation = JavaScriptObfuscator.obfuscate(sourceCode, this.inputOptions)
        const outputCode = obfuscation.getObfuscatedCode()

        // write output code to temporary file.
        const outputCodeHash = createHash('sha256').update(outputCode).digest('hex')
        const hash8 = outputCodeHash.slice(outputCodeHash.length - 8, outputCodeHash.length)
        const filenameCache = filename.replace('.js', `.${hash8}.js`)
        const outputTempPath = path.join(MODULE_OBFUSCATOR_CACHE_PATH_DIR, filenameCache)
        fs.writeFileSync(outputTempPath, outputCode, 'utf8')

        // generate response data.
        const obfuscationResult: CubegenObfuscatorResponse = {
            hash: outputCodeHash,
            outputTempPath,
            outputCode
        }

        // done.
        return obfuscationResult
    }
}
