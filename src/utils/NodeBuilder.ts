import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import randomString from 'randomstring'
import { CubegenBundler } from '@cubegenjs/bundler'
import { createHash, randomInt } from 'crypto'
import { CubegenObfuscator } from '@cubegenjs/obfuscator'
import { type CubegenJson } from '@cubegenjs/common/dist/interfaces/CobegenJson'
import { type NodeProtectorBuilderCacheOptions } from '../interfaces/CubegenBuilder'
import { type CubegenObfuscatorResponse } from '@cubegenjs/obfuscator/dist/types/Obfuscator'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/dist/interfaces/NodeProtector'
import { type CubegenBundlerOptions, type CubegenBundlerResponse } from '@cubegenjs/bundler/dist/types/Bundler'

export class NodeBuilder {
    options: NodeProtectorBuilderOptions
    cacheOptions: NodeProtectorBuilderCacheOptions
    privateKeys: string[]

    constructor (options: NodeProtectorBuilderOptions, cacheOptions: NodeProtectorBuilderCacheOptions) {
        this.options = options
        this.cacheOptions = cacheOptions
        this.privateKeys = []
    }

    /**
     * Builder Options.
     */
    async build (): Promise<void> {
        await this.generateRandomPrivateKeys()
        await this.obfuscateRuntimeProtector()
        const bundleResponse = await this.bundleProject()
        this.restoreBackupProtectorConfig()
        this.signAndCreateCubgenJson(bundleResponse)
    }

    private async generateRandomPrivateKeys (): Promise<void> {
        const spinner = ora('Generate random private keys...').start()
        const { protector } = this.cacheOptions

        // Generate random private keys.
        for (let i = 0; i < 2; i++) {
            const randomKey = randomString.generate(randomInt(128))
            this.privateKeys.push(randomKey)
        }

        // Inject random private keys into bundled files.
        let bundledRawCode = await fs.readFile(protector.bundledPath, { encoding: 'utf8' })
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_1%', this.privateKeys[0])
        bundledRawCode = bundledRawCode.replace('%PRIVATE_KEY_2%', this.privateKeys[1])
        await fs.writeFile(protector.bundledPath, bundledRawCode, 'utf-8')

        // Done.
        spinner.text = 'Generated random private keys.'
        spinner.succeed()
    }

    private async obfuscateRuntimeProtector (): Promise<void> {
        const spinner = ora('Obfuscate runtime protector...').start()
        const { rootProject, protector } = this.cacheOptions

        // Backup protector config file.
        const protectorPath = path.join(rootProject, protector.fileName)
        protector.backupBundledPath = `${protectorPath}.bak`
        fs.copyFileSync(protectorPath, protector.backupBundledPath)

        // Obfuscate protector config file.
        const obfuscator = new CubegenObfuscator(protector.bundledPath, 'node')
        const result: CubegenObfuscatorResponse = obfuscator.transform()

        // Overwrite original protector config file with obfuscated code.
        fs.copyFileSync(result.outputTempPath, protectorPath)

        // Done.
        spinner.text = 'Obfuscate runtime protector.'
        spinner.succeed()
    }

    private async bundleProject (): Promise<CubegenBundlerResponse> {
        const { rootProject } = this.cacheOptions
        const bundlerOptions: CubegenBundlerOptions = this.options.codeBundlingOptions
        bundlerOptions.rootDir = path.resolve(rootProject, bundlerOptions.rootDir)
        bundlerOptions.outDir = path.resolve(rootProject, bundlerOptions.outDir)
        bundlerOptions.buildMode = 'production'
        const bundler = new CubegenBundler(bundlerOptions)
        const bundlerResult = await bundler.build()
        return bundlerResult
    }

    private restoreBackupProtectorConfig (): void {
        const { protector } = this.cacheOptions
        if (protector.backupBundledPath === undefined) return
        fs.moveSync(protector.backupBundledPath, protector.backupBundledPath.replace('.bak', ''), { overwrite: true })
    }

    private signAndCreateCubgenJson (bundleResponse: CubegenBundlerResponse): void {
        const spinner = ora('Signaturing source code and create cubegen-lock.json...').start()
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
        const metaPath = path.join(this.options.codeBundlingOptions.outDir, 'cubegen-lock.json')
        fs.writeFileSync(metaPath, JSON.stringify(cubgenMeta, null, 4), 'utf8')
        spinner.text = 'Signatures source code safe in ' + chalk.green('cubegen-lock.json')
        spinner.succeed()
    }
}
