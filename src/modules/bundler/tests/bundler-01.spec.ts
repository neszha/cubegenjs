import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenBundler } from '../bundler'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_TEMP_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.cubegen')

describe('Test Bundler Module: test-source-code-01', () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(MODULE_PATH_DIR, 'tests/test-source-code-01'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'test-dist-01'),
        entries: [
            'main.ts',
            'nested/main.ts',
            'worker/index.js'
        ]
    })

    it('Success bundling typescript and javascript source code', async () => {
        const result = await bundler.build()

        // check response data.
        expect(Array.isArray(result)).toEqual(true)
        expect(result[0]).toHaveProperty('hash')
        expect(result[0]).toHaveProperty('buildTime')
        expect(result[0]).toHaveProperty('sourcePath')
        expect(result[0]).toHaveProperty('ouputPath')

        // check result file exits.
        expect(fs.existsSync(result[0].ouputPath)).toEqual(true)
        expect(fs.existsSync(result[1].ouputPath)).toEqual(true)
        expect(fs.existsSync(result[2].ouputPath)).toEqual(true)
    })

    it('Bundling successful to comment string', async () => {
        const result = await bundler.build()

        // check main.ts entry.
        const rawBundle1 = fs.readFileSync(result[0].ouputPath, 'utf8')
        expect(rawBundle1).not.toContain('Main program')

        // check nested/main.ts entry.
        const rawBundle2 = fs.readFileSync(result[1].ouputPath, 'utf8')
        expect(rawBundle2).not.toContain('Nested program')

        // check worker/index.js entry.
        const rawBundle3 = fs.readFileSync(result[2].ouputPath, 'utf8')
        expect(rawBundle3).not.toContain('Worker program')
    })

    it('Bundling proses does not change the functionality of the code program', async () => {
        const result = await bundler.build()

        // check main.ts entry.
        const outputSourceCodeEntry1 = execSync(`ts-node ${result[0].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry1 = execSync(`node ${result[0].ouputPath}`, { encoding: 'utf-8' })
        expect(outputSourceCodeEntry1).toEqual(outputBundleCodeEntry1)

        // check nested/main.ts entry.
        const outputSourceCodeEntry2 = execSync(`ts-node ${result[1].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry2 = execSync(`node ${result[1].ouputPath}`, { encoding: 'utf-8' })
        expect(outputSourceCodeEntry2).toEqual(outputBundleCodeEntry2)

        // check worker/index.js entry.
        const sourceDir3 = path.dirname(result[2].sourcePath)
        const outputSourceCodeEntry3 = execSync(`cd ${sourceDir3} && node ${result[2].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry3 = execSync(`node ${result[2].ouputPath}`, { encoding: 'utf-8' })
        expect(outputSourceCodeEntry3).toEqual(outputBundleCodeEntry3)
    })
})
