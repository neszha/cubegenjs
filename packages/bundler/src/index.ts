import path from 'path'
import fs from 'fs-extra'
import crypto from 'crypto'
import { SHA256 } from 'crypto-js'
import { Parcel } from '@parcel/core'
import type { BuildSuccessEvent } from '@parcel/types'
import { type PercelOptions, type CubegenBundlerOptions, type CubegenBundlerResponse, type FilePath, type CubegenBundlerEntryResponse, type CubegenBundlerStaticDirResponse } from './types/bundler'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_PARCEL_CACHE_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.cache')
const MODULE_BUNDLER_CACHE_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.bundler-cache')

/**
 * JavaScript and TypeScript Bundler Class.
 */
export class CubegenBundler {
    options: CubegenBundlerOptions
    percelOptions: PercelOptions

    constructor (options: CubegenBundlerOptions) {
        this.options = options

        // Set default percel options.
        this.percelOptions = {
            entries: '',
            defaultConfig: '@parcel/config-default',
            mode: 'production',
            shouldDisableCache: true,
            targets: {
                default: {
                    distDir: MODULE_BUNDLER_CACHE_PATH_DIR
                }
            },
            defaultTargetOptions: {
                shouldOptimize: true,
                sourceMaps: false
            },
            cacheDir: MODULE_PARCEL_CACHE_PATH_DIR
        }
    }

    async build (): Promise<CubegenBundlerResponse> {
        // initialization before run builder.
        this.initialization()
        const buildResponse: CubegenBundlerResponse = {
            hashProject: '',
            entries: [],
            staticDirs: []
        }

        // run script bundler each entry file.
        buildResponse.entries = await this.bundleEntryFile(this.options.entries)

        // move static content.
        if (this.options.staticDirs !== undefined) {
            buildResponse.staticDirs = await this.moveStaticDirectories(this.options.staticDirs)
        }

        // get hash data of project.
        buildResponse.hashProject = this.getHashOfOutputProject(this.options.outDir)

        // done
        return buildResponse
    }

    private initialization (): void {
        // recreate temporary directory.
        if (fs.existsSync(MODULE_BUNDLER_CACHE_PATH_DIR)) {
            fs.rmSync(MODULE_BUNDLER_CACHE_PATH_DIR, { recursive: true })
        }
        fs.mkdirSync(MODULE_BUNDLER_CACHE_PATH_DIR, { recursive: true })

        // recreate out directory.
        if (fs.existsSync(this.options.outDir)) {
            fs.rmSync(this.options.outDir, { recursive: true })
        }
        fs.mkdirSync(this.options.outDir, { recursive: true })
    }

    private async bundleEntryFile (entries: FilePath[]): Promise<CubegenBundlerEntryResponse[]> {
        const bundleEntriesResponse: CubegenBundlerEntryResponse[] = []
        for (const entry of entries) {
            this.percelOptions.entries = path.join(this.options.rootDir, entry)
            const buildObject = await this.bundingWithParcel()
            const bundleRaw = this.getBundleFileFormTemp()
            const outputPath = this.writeBundleToOutputPath(entry, bundleRaw)
            const bundleHash = SHA256(bundleRaw).toString()
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

    private getBundleFileFormTemp (): string {
        const files: FilePath[] = fs.readdirSync(MODULE_BUNDLER_CACHE_PATH_DIR)
        const filePath = path.resolve(MODULE_BUNDLER_CACHE_PATH_DIR, files[0] ?? 'unknow.file')
        if (!fs.existsSync(filePath)) {
            console.error('Error when reading bundle file in temporary.')
            process.exit()
        }
        return fs.readFileSync(filePath, 'utf8')
    }

    private writeBundleToOutputPath (entry: string, bundleRaw: string): string {
        // get full path entry and change ".ts" to ".js"
        const outputPath = path.resolve(this.options.outDir, entry).replace('.ts', '.js')

        // create entry directory.
        const directory = path.dirname(outputPath)
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }

        // write bundle file.
        fs.writeFileSync(outputPath, bundleRaw, 'utf8')
        return outputPath
    }

    private async moveStaticDirectories (publicDirs: FilePath[]): Promise<CubegenBundlerStaticDirResponse[]> {
        const staticDirResponse: CubegenBundlerStaticDirResponse[] = []
        for (const dirName of publicDirs) {
            // check source dir.
            const pathSourceDir = path.join(this.options.rootDir, dirName)
            if (!fs.existsSync(pathSourceDir)) continue

            // copy public dir.
            const pathDestinationDir = path.join(this.options.outDir, dirName)
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
}
