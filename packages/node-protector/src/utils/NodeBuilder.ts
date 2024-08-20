import ora from 'ora'
import path from 'path'
import chalk from 'chalk'
import fs from 'fs-extra'
import { type FilePath } from '../interfaces/Common'
import { type BuilderInputOptions } from '../interfaces/NodeBuilder'
import { type NodeProtectorBuilderOptions } from '../interfaces/NodeProtector'

export class NodeBuilder {
    private readonly inputOptions: BuilderInputOptions
    private readonly cubegenCacheDir: FilePath
    private readonly inTestEnvironment: boolean = false

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

        // Get cubegen builder config.
        const builderConfigOptions = await this.getCubegenBuilderConfig()
        console.log(builderConfigOptions)

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

        // Check file exists.
        const configFileName = 'cg.builder.js'
        const fullPath = path.join(this.inputOptions.rootDir, configFileName)
        if (!fs.existsSync(fullPath)) {
            spinner.stopAndPersist({ symbol: 'x' })
            console.log(chalk.red('Error: Can not find file `cg.builder.js` in your project directory.'))
            process.exit(0)
        }

        // Done.
        const builderOptions = await import(fullPath)
        spinner.text = 'Builder config is ready.'
        spinner.succeed()
        return builderOptions.default as NodeProtectorBuilderOptions
    }
}
