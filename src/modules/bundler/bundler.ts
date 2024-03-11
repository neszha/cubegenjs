import path from 'path'
import fs from 'fs-extra'
import { SHA256 } from 'crypto-js'
import { Parcel } from '@parcel/core'
import type { BuildSuccessEvent } from '@parcel/types'
import { type PercelOptions, type CubegenBundlerOptions, type CubegenBundlerResponseData } from './types/bundler'

const MODULE_PATH_DIR = __dirname
const MODULE_TEMP_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.cubegen')
const MODULE_TEMP_DIST_PATH_DIR = path.resolve(MODULE_TEMP_PATH_DIR, '.bundler-cache')

/**
 *
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
                    distDir: MODULE_TEMP_DIST_PATH_DIR
                }
            },
            defaultTargetOptions: {
                shouldOptimize: true,
                sourceMaps: false
            }
        }
    }

    async build (): Promise<CubegenBundlerResponseData[]> {
        // initialization before run builder.
        const buildResponses: CubegenBundlerResponseData[] = []
        this.initialization()

        // run bundler each entry file.
        for (const entry of this.options.entries) {
            this.setPercelOptions(entry)
            const buildObject = await this.bundingWithParcel()
            const bundleRaw = this.getBundleFileFormTemp()
            const outputPath = this.writeBundleToOutputPath(entry, bundleRaw)
            const bundleHash = SHA256(bundleRaw).toString()
            buildResponses.push({
                hash: bundleHash,
                buildTime: buildObject.buildTime,
                sourcePath: this.percelOptions.entries as string,
                ouputPath: outputPath
            })
        }

        // done
        return buildResponses
    }

    private initialization (): void {
        // recreate temporary directory.
        if (fs.existsSync(MODULE_TEMP_DIST_PATH_DIR)) {
            fs.rmSync(MODULE_TEMP_DIST_PATH_DIR, { recursive: true })
        }
        fs.mkdirSync(MODULE_TEMP_DIST_PATH_DIR, { recursive: true })

        // recreate out directory.
        if (fs.existsSync(this.options.outDir)) {
            fs.rmSync(this.options.outDir, { recursive: true })
        }
        fs.mkdirSync(this.options.outDir, { recursive: true })
    }

    private setPercelOptions (entry: string): void {
        // set entry file path.
        this.percelOptions.entries = path.resolve(this.options.rootDir, entry)
    }

    private async bundingWithParcel (): Promise<BuildSuccessEvent> {
        const bundler = new Parcel(this.percelOptions)
        try {
            const buildObject: BuildSuccessEvent = await bundler.run()
            return buildObject
        } catch (error) {
            console.error(error)
            process.exit()
        }
    }

    private getBundleFileFormTemp (): string {
        const files: string[] = fs.readdirSync(MODULE_TEMP_DIST_PATH_DIR)
        const filePath = path.resolve(MODULE_TEMP_DIST_PATH_DIR, files[0] ?? 'unknow.file')
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
}
