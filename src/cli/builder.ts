import path from 'path'
import fs from 'fs-extra'
import { createHash, randomInt } from 'crypto'
import { execSync } from 'child_process'
import randomString from 'randomstring'
import { CubegenBundler } from '@cubegen/bundler'
import { CubegenObfuscator } from '@cubegen/obfuscator'
import { type CubegenJson } from '../types/CobegenJson.js'
import { type FilePath, type CmdBuildOptions } from '../types/Command.js'
import { type CubegenObfuscatorResponse } from '@cubegen/obfuscator/dist/types/Obfuscator.js'
import { type CubegenNodeBuilderOptions } from '@cubegen/node-protector/dist/types/NodeProtector.js'
import { CubegenObfuscatorEnvironmentTarget } from '@cubegen/obfuscator/dist/enums/ObfuscatorEnum.js'
import { type CubegenBundlerResponse, type CubegenBundlerOptions } from '@cubegen/bundler/dist/types/Bundler.js'

let builderOptions: CubegenNodeBuilderOptions

export default {
    cacheDir: '' as string,
    options: {
        root: ''
    } satisfies CmdBuildOptions,
    protector: {
        fileName: null as string | null,
        backupPath: null as FilePath | null,
        bundledPath: null as FilePath | null
    },
    privateKeys: [] as string[],

    /**
     * Build source code to distribution code.
     */
    async build (options: CmdBuildOptions): Promise<void> {
        this.options = options
        this.init()
        await this.bundleAndGetConfigCodeProject()
        this.generateRandomPrivateKeys()
        await this.obfuscateRuntimeProtector()
        const bundleResponse = await this.bundleProject()
        this.restoreBackupProtectorConfig()
        this.createCubgenJson(bundleResponse)
    },

    /**
     * Initialization builder.
     */
    init (): void {
        this.cacheDir = path.join(this.options.root, '.cubegen-cache')
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir)
        }
    },

    /**
     * Find and get file `protector.cg.js` or `protector.cg.ts` in project directory.
     */
    async bundleAndGetConfigCodeProject (): Promise<void> {
        // Check root directory.
        if (!fs.existsSync(this.options.root)) {
            console.error('No such directory: ', this.options.root)
            process.exit()
        }

        // Find code config.
        const jsConfigFilename = 'protector.cg.js'
        const tsConfigFilename = 'protector.cg.ts'
        if (fs.existsSync(path.join(this.options.root, jsConfigFilename))) {
            this.protector.fileName = jsConfigFilename
        } else if (fs.existsSync(path.join(this.options.root, tsConfigFilename))) {
            this.protector.fileName = tsConfigFilename
        }
        if (this.protector.fileName == null) {
            console.error('Can not find `protector.cg.js` or `protector.cg.ts` in project directory.')
            process.exit()
        }

        // Bundling code config.
        const bundlerOptions: CubegenBundlerOptions = {
            rootDir: this.options.root,
            outDir: path.join(this.cacheDir, 'bundled'),
            entries: [
                this.protector.fileName
            ],
            packageJson: {
                type: 'module',
                hideDependencies: true,
                hideDevDependencies: true
            }
        }
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()
        const bundledPath = bundlerResult.entries[0].ouputPath
        this.protector.bundledPath = bundledPath

        // Get builder options from code config.
        const builderOptionsJsonString = execSync(`node ${bundledPath} --get-options`, { encoding: 'utf8' })
        builderOptions = JSON.parse(builderOptionsJsonString) as CubegenNodeBuilderOptions
    },

    /**
     * Generate random private keys to inject in protector file.
     */
    generateRandomPrivateKeys (): void {
        if (this.protector.bundledPath == null) return

        // Generate random private keys.
        this.privateKeys = []
        for (let i = 0; i < 2; i++) {
            const randomKey = randomString.generate(randomInt(128))
            this.privateKeys.push(randomKey)
        }

        // Inject random private keys into bundled files.
        let bundledRawCode = fs.readFileSync(this.protector.bundledPath, { encoding: 'utf8' })
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_1%', this.privateKeys[0])
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_2%', this.privateKeys[1])
        fs.writeFileSync(this.protector.bundledPath, bundledRawCode, 'utf-8')
    },

    /**
     * Obfuscate protector config file.
     */
    async obfuscateRuntimeProtector (): Promise<void> {
        if (this.protector.fileName == null || this.protector.bundledPath == null) {
            throw new Error('Error when geting protector path info.')
        }

        // Backup protector config file.
        const protectorPath = path.join(this.options.root, this.protector.fileName)
        this.protector.backupPath = `${protectorPath}.bak`
        fs.copyFileSync(protectorPath, this.protector.backupPath)

        // Obfuscate protector config file.
        const obfuscator = new CubegenObfuscator(this.protector.bundledPath, CubegenObfuscatorEnvironmentTarget.NODE)
        const result: CubegenObfuscatorResponse = obfuscator.transform()

        // Overwrite original protector config file with obfuscated code.
        fs.copyFileSync(result.outputTempPath, protectorPath)
    },

    /**
     * Bundling project with bundler module.
     */
    async bundleProject (): Promise<CubegenBundlerResponse> {
        const bundlerOptions: CubegenBundlerOptions = builderOptions.codeBundlingOptions
        bundlerOptions.rootDir = path.resolve(this.options.root, bundlerOptions.rootDir)
        bundlerOptions.outDir = path.resolve(this.options.root, bundlerOptions.outDir)
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()
        return bundlerResult
    },

    /**
     * Restore original protector config file.
     */
    restoreBackupProtectorConfig (): void {
        if (this.protector.backupPath === null) return
        fs.moveSync(this.protector.backupPath, this.protector.backupPath.replace('.bak', ''), { overwrite: true })
    },

    /**
     * Generate meta data.
     */
    createCubgenJson (bundleResponse: CubegenBundlerResponse): void {
        const cubgenMeta: CubegenJson = {
            hashProject: bundleResponse.hashProject,
            signatures: []
        }
        for (const entryData of bundleResponse.entries) {
            const plainTextArray = this.privateKeys.concat(entryData.hash.replace('sha256:', ''))
            const singnatureContent = plainTextArray.join('.')
            const hash = createHash('sha512').update(singnatureContent)
            cubgenMeta.signatures.push({
                entryName: entryData.fromEntry,
                signature: `sha512:${hash.digest('hex')}`
            })
        }
        const metaPath = path.join(builderOptions.codeBundlingOptions.outDir, 'cubegen-lock.json')
        fs.writeFileSync(metaPath, JSON.stringify(cubgenMeta, null, 4), 'utf8')
    }
}
