import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenBundler } from '@cubegen/bundler'

export default {
    projectDir: '' as string,
    cacheDir: '' as string,

    /**
     * Build source code to distribution code.
     */
    async build (): Promise<void> {
        this.init()
        await this.getConfigCodeProject()
    },

    /**
     * Initialization builder.
     */
    init (): void {
        this.projectDir = process.cwd()
        this.cacheDir = path.join(this.projectDir, '.cubegen-cache')
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir)
        }
    },

    /**
     * Find and get file `protector.cg.js` or `protector.cg.ts` in project directory.
     */
    async getConfigCodeProject (): Promise<void> {
        // Find code config.
        const files = fs.readdirSync(this.projectDir)
        const filesProtectors = files.filter(file => file === 'protector.cg.js' || file === 'protector.cg.ts')
        if (filesProtectors.length === 0) {
            throw new Error('Can not find `protector.cg.js` or `protector.cg.ts` in project directory.')
        }

        // Bundling code config.
        const bundler = new CubegenBundler({
            rootDir: this.projectDir,
            outDir: path.join(this.cacheDir, 'bundled'),
            entries: [
                filesProtectors[0]
            ]
        })
        const bundlerResult = await bundler.build()
        const bundledPath = bundlerResult.entries[0].ouputPath

        // Get builder options from code config.
        // const codeConfigRaw = fs.readFileSync(bundlerResult.entries[0].ouputPath, 'utf8')
        const res = execSync(`node ${bundledPath} --get-options`, { encoding: 'utf8', input: 'asdf' })
        console.log(res)
    }
}
