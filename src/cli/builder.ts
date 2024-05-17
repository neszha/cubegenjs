import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenBundler } from '@cubegen/bundler'
import { type FilePath, type CmdBuildOptions } from '../bin/types/Command.js'

export default {
    cacheDir: '' as string,
    options: {
        root: ''
    } satisfies CmdBuildOptions,

    /**
     * Build source code to distribution code.
     */
    async build (options: CmdBuildOptions): Promise<void> {
        this.options = options
        this.init()
        await this.getConfigCodeProject()
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
    async getConfigCodeProject (): Promise<void> {
        // Check root directory.
        if (!fs.existsSync(this.options.root)) {
            console.error('No such directory: ', this.options.root)
            process.exit()
        }

        // Find code config.
        let useRelativePath: FilePath | null = null
        const jsConfigFilename = 'protector.cg.js'
        const tsConfigFilename = 'protector.cg.ts'
        if (fs.existsSync(path.join(this.options.root, jsConfigFilename))) {
            useRelativePath = jsConfigFilename
        } else if (fs.existsSync(path.join(this.options.root, tsConfigFilename))) {
            useRelativePath = tsConfigFilename
        }
        if (useRelativePath == null) {
            console.error('Can not find `protector.cg.js` or `protector.cg.ts` in project directory.')
            process.exit()
        }

        // Bundling code config.
        const bundler = new CubegenBundler({
            rootDir: this.options.root,
            outDir: path.join(this.cacheDir, 'bundled'),
            entries: [
                useRelativePath
            ],
            packageJson: {
                type: 'commonjs',
                hideDependencies: true,
                hideDevDependencies: true
            }
        })
        const bundlerResult = await bundler.build()
        const bundledPath = bundlerResult.entries[0].ouputPath

        // Get builder options from code config.
        console.log(bundlerResult)
        // const codeConfigRaw = fs.readFileSync(bundlerResult.entries[0].ouputPath, 'utf8')
        // const res = execSync(`node ${bundledPath} --get-options`, { encoding: 'utf8', input: 'asdf' })
        // console.log(res)
    }
}
