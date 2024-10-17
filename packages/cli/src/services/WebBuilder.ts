import path from 'path'
import fs from 'fs-extra'
import { delay } from 'listr2'
import { spawn } from 'child_process'
import { CubegenBundler } from '@cubegenjs/bundler'
import { CubegenObfuscator } from '@cubegenjs/obfuscator'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type CubegenObfuscatorResponse } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type WebBuilderInputOptions } from '../interfaces/Builder'
import { type FilePath } from '../interfaces/Common'

export class WebBuilder {
    private readonly inputOptions: WebBuilderInputOptions
    private readonly cubegenCacheDir: FilePath
    private readonly inTestEnvironment: boolean = false

    constructor (inputOptions: WebBuilderInputOptions) {
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
        const protectorBundlePath: FilePath = await this.bundleProtectorFile()
        await this.obfuscateProtector(protectorBundlePath)

        // Bundle project to distribution project.
        await this.buildWithWebFrameworkBundlerCommand()
        await this.restoreBackupProtectorFile()

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
     * Build project with bundler web framework command.
     */
    private async buildWithWebFrameworkBundlerCommand (): Promise<void> {
        this.inputOptions.observer.next('Bundle your project code...')

        // Run bundler command.
        if (!this.inputOptions.builderConfig.buildCommand.trim()) return
        await new Promise((resolve) => {
            const buildProcess = spawn(this.inputOptions.builderConfig.buildCommand, {
                shell: true,
                cwd: this.inputOptions.rootDir
            })
            buildProcess.stdout.on('data', (data) => {
                this.inputOptions.observer.next(data)
            })
            buildProcess.stderr.on('data', (data) => {
                this.inputOptions.observer.error(new Error('Error when running build command: ' + this.inputOptions.builderConfig.buildCommand))
            })
            buildProcess.on('close', () => {
                resolve(true)
            })
        })
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
}
