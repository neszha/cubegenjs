import ora from 'ora'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenBundler } from '@cubegenjs/bundler'
import { NodeBuilder } from '../utils/NodeBuilder.js'
import { type FilePath } from '../interfaces/Common.js'
import { type CmdBuildOptions } from '../interfaces/Command'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/src/interfaces/Bundler'
import { type NodeProtectorBuilderCacheOptions, type CubgenBuilderOptions } from '../interfaces/CubegenBuilder'

export class CubegenBuilder {
    cacheDir: FilePath
    options: CmdBuildOptions
    protectorFileName: string | null = null
    protectorBundledPath: FilePath | null = null
    builderOptions: CubgenBuilderOptions | null = null

    constructor (options: CmdBuildOptions) {
        this.options = options
        this.cacheDir = path.join(this.options.root, '.cubegen-cache')
    }

    async build (): Promise<void> {
        this.init()
        await this.bundleProtectorAndGetBuilderOptionsJson()
        if (this.builderOptions == null || this.protectorBundledPath == null || this.protectorFileName == null) return
        if (this.builderOptions.targetEnvironment === 'node') {
            const cacheOptions: NodeProtectorBuilderCacheOptions = {
                rootProject: this.options.root,
                protector: {
                    fileName: this.protectorFileName,
                    bundledPath: this.protectorBundledPath
                }
            }
            const nodeBuilder = new NodeBuilder(this.builderOptions, cacheOptions)
            await nodeBuilder.build()
        } else if (this.builderOptions.targetEnvironment === 'browser') {
            // Next session.
        }
        console.log('.', chalk.green('Done.'))
    }

    init (): void {
        console.log('. Starting building process.')
        const spinner = ora('Run cubegen builder...').start()
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir)
        }
        spinner.text = 'Root directory: ' + chalk.green(this.options.root)
        spinner.succeed()
    }

    private async bundleProtectorAndGetBuilderOptionsJson (): Promise<void> {
        const spinner = ora('Getting builder options...').start()

        // Check root directory.
        if (!fs.existsSync(this.options.root)) {
            console.error('No such directory: ', this.options.root)
            process.exit()
        }

        // Find code config.
        const jsConfigFilename = 'protector.cg.js'
        const tsConfigFilename = 'protector.cg.ts'
        if (fs.existsSync(path.join(this.options.root, jsConfigFilename))) {
            this.protectorFileName = jsConfigFilename
        } else if (fs.existsSync(path.join(this.options.root, tsConfigFilename))) {
            this.protectorFileName = tsConfigFilename
        }
        if (this.protectorFileName == null) {
            spinner.stopAndPersist({ symbol: 'x' })
            console.log(chalk.red('Error: Can not find `protector.cg.js` or `protector.cg.ts` in your project directory.'))
            process.exit()
        }

        // Bundling code config.
        const bundlerOptions: CubegenBundlerOptions = {
            rootDir: this.options.root,
            outDir: path.join(this.cacheDir, 'bundled'),
            entries: [
                this.protectorFileName
            ],
            packageJson: {
                type: 'module',
                hideDependencies: true,
                hideDevDependencies: true
            },
            buildMode: 'development'
        }
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()
        this.protectorBundledPath = bundlerResult.entries[0].ouputPath

        // Get builder options from code config.
        const builderOptionsJsonString = execSync(`node ${this.protectorBundledPath} --get-options`, { encoding: 'utf8' })
        this.builderOptions = JSON.parse(builderOptionsJsonString) as CubgenBuilderOptions

        // Done.
        spinner.text = `Getting builder options => Target environment: ${chalk.green(this.builderOptions.targetEnvironment)}`
        spinner.succeed()
    }
}
