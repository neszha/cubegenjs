import path from 'path'
import fs from 'fs-extra'
import { createHash } from 'crypto'
import JavaScriptObfuscator from 'javascript-obfuscator'
import { type FilePath } from './interfaces/Common'
import obfuscatorDefaultConfig from './configs/obfuscator.default-config'
import { type ObfuscatorTargetEnvironment, type CubegenObfuscatorOptions, type CubegenObfuscatorResponse } from './interfaces/Obfuscator'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_OBFUSCATOR_CACHE_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.obfuscator-cache')

/**
 * Core class for obfuscate JavaScript source code.
 */
export class CubegenObfuscator {
    sourceCodePath: FilePath
    private inputOptions: CubegenObfuscatorOptions

    constructor (sourceCodePath: FilePath, environmentTarget: ObfuscatorTargetEnvironment = 'node') {
        this.sourceCodePath = sourceCodePath

        // Set default config options.
        this.inputOptions = {
            ...obfuscatorDefaultConfig,
            target: environmentTarget
        }

        // Setup cache directory.
        if (!fs.existsSync(MODULE_OBFUSCATOR_CACHE_PATH_DIR)) {
            fs.mkdirSync(MODULE_OBFUSCATOR_CACHE_PATH_DIR)
        }
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
     * Get obfuscator config options.
     *
     * @return CubegenObfuscatorOptions
     */
    getConfig (): CubegenObfuscatorOptions {
        return this.inputOptions
    }

    /**
     * Transform source code with obfuscator tool.
     *
     * @return CubegenObfuscatorResponse
     */
    transform (): CubegenObfuscatorResponse {
        // Read source code.
        const filename = path.basename(this.sourceCodePath)
        const sourceCode = fs.readFileSync(this.sourceCodePath, 'utf8')

        // Run obfuscation.
        const obfuscation = JavaScriptObfuscator.obfuscate(sourceCode, this.inputOptions)
        const outputCode = obfuscation.getObfuscatedCode()

        // Write output code to temporary file.
        const outputCodeHash = createHash('sha256').update(outputCode).digest('hex')
        const hash8 = outputCodeHash.slice(outputCodeHash.length - 8, outputCodeHash.length)
        const filenameCache = filename.replace('.js', `.${hash8}.js`)
        const outputTempPath = path.join(MODULE_OBFUSCATOR_CACHE_PATH_DIR, filenameCache)
        fs.writeFileSync(outputTempPath, outputCode, 'utf8')

        // Build response data.
        const obfuscationResult: CubegenObfuscatorResponse = {
            hash: 'sha256:' + outputCodeHash,
            outputTempPath,
            outputCode
        }

        // Done.
        return obfuscationResult
    }
}
