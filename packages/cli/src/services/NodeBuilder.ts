// import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { delay } from 'listr2'
import { createHash } from 'crypto'
import { CubegenBundler } from '@cubegenjs/bundler'
import { CubegenObfuscator } from '@cubegenjs/obfuscator'
import { type CubegenObfuscatorResponse } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/dist/interfaces/NodeProtector'
import { type CubegenBundlerResponse, type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type NodeBuilderInputOptions } from '../interfaces/Builder'
import { type CubegenLockJson } from '../interfaces/CobegenLockJson'
import { type FilePath } from '../interfaces/Common'

export class NodeBuilder {
    private readonly inputOptions: NodeBuilderInputOptions
    private readonly cubegenCacheDir: FilePath
    private readonly inTestEnvironment: boolean = false
    private privateKeys: string[] = []

    constructor (inputOptions: NodeBuilderInputOptions) {
        this.inputOptions = inputOptions
        this.cubegenCacheDir = path.join(this.inputOptions.rootDir, '.cubegen-cache')
        if (process.env.NODE_ENV === 'test') {
            this.inTestEnvironment = true
        }
    }

    /**
     * Build project.
     */
    async build (): Promise<void> {
        // Init.
        await this.initCubegenCacheDir()

        // Bundle and obfuscate protecotr file.
        const builderConfigOptions: NodeProtectorBuilderOptions = await this.getCubegenBuilderConfig()
        const protectorBundlePath: FilePath = await this.bundleProtectorFile()
        const protectionDevBundleWithKeyPath: FilePath = await this.generateAndInjectPrivateKeys(protectorBundlePath, builderConfigOptions.appKey)
        await this.obfuscateProtector(protectionDevBundleWithKeyPath)

        // Bundle project to distribution project.
        const bundleResponse = await this.bundleProject(builderConfigOptions.codeBundlingOptions)
        await this.restoreBackupProtectorFile()
        await this.signAndCreateCubegenJson(builderConfigOptions, bundleResponse)

        // Done.
        setTimeout(() => {
            this.inputOptions.observer.complete()
        }, 1_000)
    }

    /**
     * Init cubagen cache diractory.
     */
    private async initCubegenCacheDir (): Promise<void> {
        this.inputOptions.observer.next('Init cubegen cache diractory...')
        await delay(250)

        // Check root directory.
        if (!fs.existsSync(this.inputOptions.rootDir)) {
            console.error('No such directory: ', this.inputOptions.rootDir)
            process.exit()
        }

        // Create cubegen cache directory.
        if (!fs.existsSync(this.cubegenCacheDir)) {
            fs.mkdirSync(this.cubegenCacheDir)
        }
    }

    /**
     * Get cubgen builder config in project directory.
     */
    private async getCubegenBuilderConfig (): Promise<NodeProtectorBuilderOptions> {
        this.inputOptions.observer.next('Get cubegen builder config...')
        await delay(250)

        // Check bundler config file exists.
        const configFileName = 'cg.builder.js'
        const builderFilePath = path.join(this.inputOptions.rootDir, configFileName)
        if (!fs.existsSync(builderFilePath)) {
            throw new Error('Error: Can not find file `cg.builder.js` in your project directory')
        }

        // Done.
        const builderOptions = await import(builderFilePath)
        return builderOptions.default as NodeProtectorBuilderOptions
    }

    /**
     * Bundle cubegen protector file with development mode.
     */
    private async bundleProtectorFile (): Promise<FilePath> {
        this.inputOptions.observer.next('Bundling protector file...')
        await delay(250)

        // Check protector config file exists.
        const configFileName = 'cg.protector.js'
        const protectorFilePath = path.join(this.inputOptions.rootDir, configFileName)
        if (!fs.existsSync(protectorFilePath)) {
            throw new Error('Error: Can not find file `cg.protector.js` in your project directory')
        }

        // Bundle with bundler module.
        const bundlerOptions: CubegenBundlerOptions = {
            rootDir: this.inputOptions.rootDir,
            outDir: path.join(this.cubegenCacheDir, 'protector_bundled'),
            entries: [
                'cg.protector.js'
            ],
            buildMode: 'development',
            includeNodeModules: true
        }
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()

        // Done.
        return bundlerResult.entries[0].ouputPath
    }

    /**
     * Generate and inject private keys into protector dev bundled file.
     */
    private async generateAndInjectPrivateKeys (protectorDevBundlePath: FilePath, appKey: string): Promise<FilePath> {
        this.inputOptions.observer.next('Generate private keys and inject into protector...')
        await delay(250)

        // Read raw content.
        let bundledRawCode = await fs.readFile(protectorDevBundlePath, { encoding: 'utf8' })

        // Activate distributed mode.
        bundledRawCode = bundledRawCode.replace('%IN_DEVELOPMENT_MODE%', 'distributed')

        // Generate private keys ans inject into protector.
        const privateKey01 = createHash('md5').update(appKey).digest('hex')
        const privateKey02 = createHash('sha256').update(appKey + privateKey01).digest('hex')
        const privateKey03 = createHash('sha512').update(appKey + privateKey02).digest('hex')
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_01%', privateKey01)
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_02%', privateKey02)
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_03%', privateKey03)
        this.privateKeys = [privateKey01, privateKey02, privateKey03]

        // Write raw content.
        const outDirPath = path.join(this.cubegenCacheDir, 'protector_keys')
        const outFilePath = path.join(outDirPath, 'cg.protector.js')
        await fs.ensureDir(outDirPath)
        await fs.writeFile(outFilePath, bundledRawCode, 'utf-8')

        // Done.
        return outFilePath
    }

    /**
     *  Obfuscate protector with Obfuscator module.
     */
    private async obfuscateProtector (protectorDevBundleWithKeysPath: FilePath): Promise<void> {
        this.inputOptions.observer.next('Obfuscate protector code...')

        // Obfuscate protector bundled file.
        const protectorOutDirPath = path.join(this.cubegenCacheDir, 'protector_obfus')
        const protectorOutFilePath = path.join(protectorOutDirPath, 'cg.protector.js')
        const obfuscator = new CubegenObfuscator(protectorDevBundleWithKeysPath, 'node')
        const result: CubegenObfuscatorResponse = obfuscator.transform()
        await fs.ensureDir(protectorOutDirPath)
        await fs.copyFile(result.outputTempPath, protectorOutFilePath)

        // Backup protector file in project.
        const protectorPath = path.join(this.inputOptions.rootDir, 'cg.protector.js')
        const protectorBackupPath = path.join(this.inputOptions.rootDir, 'cg.protector.js.bak')
        await fs.copyFile(protectorPath, protectorBackupPath)

        // Overwrite original protector file with obfuscated protector.
        fs.copyFileSync(protectorOutFilePath, protectorPath)
    }

    /**
     * Bundle project with Bundler module.
     */
    private async bundleProject (bundlerOptions: CubegenBundlerOptions): Promise<CubegenBundlerResponse> {
        this.inputOptions.observer.next('Bundle your project code...')

        // Run bundling.
        bundlerOptions.rootDir = path.resolve(this.inputOptions.rootDir, bundlerOptions.rootDir)
        bundlerOptions.outDir = path.resolve(this.inputOptions.rootDir, bundlerOptions.outDir)
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()

        // Done.
        return bundlerResult
    }

    /**
     * Restoring backup protector file.
     */
    private async restoreBackupProtectorFile (): Promise<void> {
        this.inputOptions.observer.next('Restore backup protector file...')
        await delay(250)
        const protectorPath = path.join(this.inputOptions.rootDir, 'cg.protector.js')
        const protectorBackupPath = path.join(this.inputOptions.rootDir, 'cg.protector.js.bak')
        if (fs.existsSync(protectorBackupPath)) {
            await fs.move(protectorBackupPath, protectorPath, { overwrite: true })
        }
    }

    /**
     * Sign project file and create cubegen.json file.
     */
    private async signAndCreateCubegenJson (builderOptions: NodeProtectorBuilderOptions, bundleResponse: CubegenBundlerResponse): Promise<void> {
        this.inputOptions.observer.next('Signaturing source code and create cubegen-lock.json...')
        await delay(250)
        const cubgenMeta: CubegenLockJson = {
            hashProject: bundleResponse.hash,
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
