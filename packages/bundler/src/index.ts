import path from 'path'
import fs from 'fs-extra'
import crypto from 'crypto'
import { Parcel } from '@parcel/core'
import type { BuildSuccessEvent } from '@parcel/types'
import { type FilePath } from './interfaces/Common'
import { type PercelOptions, type CubegenBundlerOptions, type CubegenBundlerResponse, type CubegenBundlerEntryResponse, type CubegenBundlerStaticDirResponse, type CustomCubegenBundlerOptions } from './interfaces/Bundler'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_PARCEL_CACHE_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.cache')
const MODULE_BUNDLER_CACHE_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.bundler-cache')

/**
 * JavaScript Bundler Class with Parcel.
 */
export class CubegenBundler {
    private inputOptions: CubegenBundlerOptions
    private readonly percelOptions: PercelOptions

    constructor (inputOptions: CubegenBundlerOptions) {
        this.inputOptions = inputOptions

        // Set default percel options.
        this.percelOptions = {
            entries: '',
            defaultConfig: '@parcel/config-default',
            mode: (inputOptions.buildMode === 'development') ? 'development' : 'production',
            shouldDisableCache: true,
            targets: {
                default: {
                    context: 'node',
                    engines: {
                        node: '>= 18'
                    },
                    outputFormat: 'esmodule',
                    includeNodeModules: false,
                    distDir: MODULE_BUNDLER_CACHE_PATH_DIR
                }
            },
            defaultTargetOptions: {
                engines: {
                    node: '>= 18'
                },
                outputFormat: 'esmodule',
                shouldOptimize: (inputOptions.buildMode === 'production' || inputOptions.buildMode === undefined),
                sourceMaps: false,
                shouldScopeHoist: true
            },
            cacheDir: MODULE_PARCEL_CACHE_PATH_DIR
        }
    }

    /**
     * Get input options.
     */
    getInputOptions (): CubegenBundlerOptions {
        return this.inputOptions
    }

    /**
     * Constom input options.
     *
     * @param constomInputOptions
     */
    setConstomInputOptions (constomInputOptions: CustomCubegenBundlerOptions): void {
        this.inputOptions = {
            ...this.inputOptions,
            ...constomInputOptions
        }
    }

    /**
     * Bundling JavaScript source code.
     */
    async build (): Promise<CubegenBundlerResponse> {
        // Initialization before run builder.
        this.initDirectoryBuilder()
        const buildResponse: CubegenBundlerResponse = {
            hash: '',
            entries: [],
            staticDirs: []
        }

        // Run script bundler each entry file.
        buildResponse.entries = await this.bundleEntryFile(this.inputOptions.entries)

        // Move static content.
        if (this.inputOptions.staticDirs !== undefined) {
            buildResponse.staticDirs = await this.moveStaticDirectories(this.inputOptions.staticDirs)
        }

        // Get hash data of project.
        buildResponse.hash = this.getHashOfOutputProject(this.inputOptions.outDir)

        // Generate package json.
        this.generatePackageJson()

        // Done.
        return buildResponse
    }

    /**
     * Init temp and out directory.
     */
    private initDirectoryBuilder (): void {
        // Recreate temporary directory.
        if (fs.existsSync(MODULE_BUNDLER_CACHE_PATH_DIR)) {
            fs.rmSync(MODULE_BUNDLER_CACHE_PATH_DIR, { recursive: true })
        }
        fs.mkdirSync(MODULE_BUNDLER_CACHE_PATH_DIR, { recursive: true })

        // Recreate out directory.
        if (fs.existsSync(this.inputOptions.outDir)) {
            fs.rmSync(this.inputOptions.outDir, { recursive: true })
        }
        fs.mkdirSync(this.inputOptions.outDir, { recursive: true })
    }

    /**
     * Bundle JavaScript entry file.
     *
     * @param entries
     */
    private async bundleEntryFile (entries: FilePath[]): Promise<CubegenBundlerEntryResponse[]> {
        const bundleEntriesResponse: CubegenBundlerEntryResponse[] = []
        for (const entry of entries) {
            this.percelOptions.entries = path.join(this.inputOptions.rootDir, entry)
            const buildObject = await this.bundingWithParcel()
            const bundleRaw = this.getBundleFileFormTemp()
            const outputPath = this.writeBundleToOutputPath(entry, bundleRaw)
            const bundleHash = crypto.createHash('sha256').update(bundleRaw).digest('hex')
            bundleEntriesResponse.push({
                fromEntry: entry,
                hash: `sha256:${bundleHash}`,
                buildTime: buildObject.buildTime,
                sourcePath: this.percelOptions.entries,
                ouputPath: outputPath
            })
        }
        return bundleEntriesResponse
    }

    /**
     * Bundling JavaScript source code with Parcel.
     */
    private async bundingWithParcel (): Promise<BuildSuccessEvent> {
        const bundler = new Parcel(this.percelOptions)
        try {
            await fs.emptyDir(MODULE_BUNDLER_CACHE_PATH_DIR)
            const buildObject: BuildSuccessEvent = await bundler.run()
            return buildObject
        } catch (error) {
            console.error(error)
            process.exit()
        }
    }

    /**
     * Read bundled file in temporary.
     *
     * @returns string
     */
    private getBundleFileFormTemp (): string {
        const files: FilePath[] = fs.readdirSync(MODULE_BUNDLER_CACHE_PATH_DIR)
        const filePath = path.resolve(MODULE_BUNDLER_CACHE_PATH_DIR, files[0] ?? 'unknow.file')
        if (!fs.existsSync(filePath)) {
            console.error('Error when reading bundle file in temporary.')
            process.exit()
        }
        return fs.readFileSync(filePath, 'utf8')
    }

    /**
     * Write bundle file to output path.
     *
     * @param entry
     * @param bundleRaw
     * @returns string
     */
    private writeBundleToOutputPath (entry: string, bundleRaw: string): string {
        // Get full path entry and change ".ts" to ".js"
        const outputPath = path.resolve(this.inputOptions.outDir, entry).replace('.ts', '.js')

        // Create entry directory.
        const directory = path.dirname(outputPath)
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }

        // Write bundle file.
        fs.writeFileSync(outputPath, bundleRaw, 'utf8')
        return outputPath
    }

    /**
     * Move static content to output directory.
     *
     * @param publicDirs
     */
    private async moveStaticDirectories (publicDirs: FilePath[]): Promise<CubegenBundlerStaticDirResponse[]> {
        const staticDirResponse: CubegenBundlerStaticDirResponse[] = []
        for (const dirName of publicDirs) {
            // check source dir.
            const pathSourceDir = path.join(this.inputOptions.rootDir, dirName)
            if (!fs.existsSync(pathSourceDir)) continue

            // copy public dir.
            const pathDestinationDir = path.join(this.inputOptions.outDir, dirName)
            await fs.copy(pathSourceDir, pathDestinationDir, { overwrite: true })

            // save meta data.
            staticDirResponse.push({
                fromStaticDir: dirName,
                sourceDirPath: pathSourceDir,
                ouputDirPath: pathDestinationDir
            })
        }
        return staticDirResponse
    }

    /**
     * Get hash sha256 of output project.
     *
     * @param outDir
     * @returns string
     */
    private getHashOfOutputProject (outDir: FilePath): string {
        const hash = crypto.createHash('sha256')
        const traverseDirectory = (currentDir: FilePath): void => {
            const files = fs.readdirSync(currentDir)
            files.sort()
            for (const file of files) {
                const filePath = path.join(currentDir, file)
                const stat = fs.statSync(filePath)
                if (stat.isDirectory()) {
                    traverseDirectory(filePath)
                } else if (stat.isFile()) {
                    const fileData = fs.readFileSync(filePath)
                    hash.update(fileData)
                }
            }
        }
        traverseDirectory(outDir)
        return `sha256:${hash.digest('hex')}`
    }

    /**
     * Generate new package.json for distribution project.
     */
    private generatePackageJson (): void {
        // Check package.json in root project.
        const packageJsonPath = path.join(this.inputOptions.rootDir, 'package.json')
        if (!fs.existsSync(packageJsonPath)) return

        // Read original package.json.
        const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8')
        const packageJson = JSON.parse(packageJsonString)

        // Manipulate package.json.
        delete packageJson.devDependencies

        // Write new package.json.
        fs.writeFileSync(path.join(this.inputOptions.outDir, 'package.json'), JSON.stringify(packageJson, null, 4), 'utf8')
    }
}
