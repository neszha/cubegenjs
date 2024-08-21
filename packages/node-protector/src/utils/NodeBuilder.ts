import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { createHash } from 'crypto'
import { type CubegenBundlerResponse, type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type CubegenObfuscatorResponse } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type NodeProtectorBuilderOptions } from '../interfaces/NodeProtector'
import { type BuilderInputOptions } from '../interfaces/NodeBuilder'
import { CubegenObfuscator } from '@cubegenjs/obfuscator/dist'
import { type CubegenJson } from '../interfaces/CobegenJson'
import { CubegenBundler } from '@cubegenjs/bundler/dist'
import { type FilePath } from '../interfaces/Common'

export class NodeBuilder {
    private readonly inputOptions: BuilderInputOptions
    private readonly cubegenCacheDir: FilePath
    private readonly inTestEnvironment: boolean = false
    private privateKeys: string[] = []

    constructor (inputOptions: BuilderInputOptions) {
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
        console.log('. Starting building process.')
        const startTime = new Date().getTime()
        this.initCubegenCacheDir()

        // Bundle and obfuscate protecotr file.
        const builderConfigOptions: NodeProtectorBuilderOptions = await this.getCubegenBuilderConfig()
        const protectorDevBundlePath: FilePath = await this.bundleProtectorFileModeDev()
        const protectionDevBundleWithKeyPath: FilePath = await this.generateAndInjectPrivateKeys(protectorDevBundlePath, builderConfigOptions.appKey)
        await this.obfuscateProtector(protectionDevBundleWithKeyPath)

        // Bundle project to distribution project.
        const bundleResponse = await this.bundleProject(builderConfigOptions.codeBundlingOptions)
        await this.restoreBackupProtectorFile()
        await this.signAndCreateCubegenJson(builderConfigOptions, bundleResponse)

        // Show process duration info.
        const endTime = new Date().getTime() - startTime
        const durationInSeconds = endTime / 1000
        console.log('.', `Done in ${durationInSeconds.toFixed(1)}s`)
    }

    /**
     * Init cubagen cache diractory.
     */
    private initCubegenCacheDir (): void {
        const spinner = ora('Run cubegen builder...').start()

        // Check root directory.
        if (!fs.existsSync(this.inputOptions.rootDir)) {
            console.error('No such directory: ', this.inputOptions.rootDir)
            process.exit()
        }

        // Create cubegen cache directory.
        if (!fs.existsSync(this.cubegenCacheDir)) {
            fs.mkdirSync(this.cubegenCacheDir)
        }

        spinner.text = 'Root directory: ' + chalk.green(this.inputOptions.rootDir)
        spinner.succeed()
    }

    /**
     * Get cubgen builder config in project directory.
     */
    private async getCubegenBuilderConfig (): Promise<NodeProtectorBuilderOptions> {
        const spinner = ora('Getting builder options...').start()

        // Check bundler config file exists.
        const configFileName = 'cg.builder.js'
        const builderFilePath = path.join(this.inputOptions.rootDir, configFileName)
        if (!fs.existsSync(builderFilePath)) {
            spinner.stopAndPersist({ symbol: 'x' })
            console.log(chalk.red('Error: Can not find file `cg.builder.js` in your project directory.'))
            process.exit(0)
        }

        // Done.
        const builderOptions = await import(builderFilePath)
        spinner.text = 'Builder config is ready.'
        spinner.succeed()
        return builderOptions.default as NodeProtectorBuilderOptions
    }

    /**
     * Bundle cubegen protector file with development mode.
     */
    private async bundleProtectorFileModeDev (): Promise<FilePath> {
        const spinner = ora('Bundling protector file...').start()

        // Check protector config file exists.
        const configFileName = 'cg.protector.js'
        const protectorFilePath = path.join(this.inputOptions.rootDir, configFileName)
        if (!fs.existsSync(protectorFilePath)) {
            spinner.stopAndPersist({ symbol: 'x' })
            console.log(chalk.red('Error: Can not find file `cg.protector.js` in your project directory.'))
            process.exit(0)
        }

        // Bundle with bundler module.
        const bundlerOptions: CubegenBundlerOptions = {
            rootDir: this.inputOptions.rootDir,
            outDir: path.join(this.cubegenCacheDir, 'protector_bundled'),
            entries: [
                'cg.protector.js'
            ],
            buildMode: 'development'
        }
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()

        // Done.
        spinner.text = 'Protector file is ready.'
        spinner.succeed()
        return bundlerResult.entries[0].ouputPath
    }

    /**
     * Generate and inject private keys into protector dev bundled file.
     */
    private async generateAndInjectPrivateKeys (protectorDevBundlePath: FilePath, appKey: string): Promise<FilePath> {
        const spinner = ora('Generate private keys and inject into protector...').start()

        // Read raw content.
        let bundledRawCode = await fs.readFile(protectorDevBundlePath, { encoding: 'utf8' })

        // Activate distributed mode.
        bundledRawCode = bundledRawCode.replace('%IN_DEVELOPMENT_MODE%', 'distributed')

        // Generate private keys ans inject into protector.
        const privateKey01 = createHash('sha256').update(appKey).digest('hex')
        const privateKey02 = createHash('sha512').update(appKey).digest('hex')
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_01%', privateKey01)
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_02%', privateKey02)
        this.privateKeys = [privateKey01, privateKey02]

        // Write raw content.
        const outDirPath = path.join(this.cubegenCacheDir, 'protector_keys')
        const outFilePath = path.join(outDirPath, 'cg.protector.js')
        await fs.ensureDir(outDirPath)
        await fs.writeFile(outFilePath, bundledRawCode, 'utf-8')

        // Done.
        spinner.text = 'Private keys is injected into protector.'
        spinner.succeed()
        return outFilePath
    }

    /**
     *  Obfuscate protector with Obfuscator module.
     */
    private async obfuscateProtector (protectorDevBundleWithKeysPath: FilePath): Promise<void> {
        const spinner = ora('Obfuscate protector...').start()

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

        // Done.
        spinner.text = 'Obfuscate protector.'
        spinner.succeed()
    }

    /**
     * Bundle project with Bundler module.
     */
    private async bundleProject (bundlerOptions: CubegenBundlerOptions): Promise<CubegenBundlerResponse> {
        const spinner = ora('Bundle your project code...').start()

        // Run bundling.
        const outDirRelative = bundlerOptions.outDir
        bundlerOptions.rootDir = path.resolve(this.inputOptions.rootDir, bundlerOptions.rootDir)
        bundlerOptions.outDir = path.resolve(this.inputOptions.rootDir, bundlerOptions.outDir)
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()

        // Done.
        spinner.text = 'Bundle project code saved in ' + chalk.green(outDirRelative)
        spinner.succeed()
        return bundlerResult
    }

    /**
     * Restoring backup protector file.
     */
    private async restoreBackupProtectorFile (): Promise<void> {
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
        const spinner = ora('Signaturing source code and create cubegen-lock.json...').start()
        const cubgenMeta: CubegenJson = {
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
        spinner.text = 'Signatures of your code saved in ' + chalk.green('cubegen-lock.json')
        spinner.succeed()
    }
}
