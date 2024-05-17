import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenBundler } from '../src/index'
import { type CubegenBundlerResponse } from './types/Bundler'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_TEMP_PATH_DIR = path.join(MODULE_PATH_DIR, '.test-temp')

describe('Test Functional Bundler Module', () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(MODULE_PATH_DIR, 'test/examples/source-code'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'out-test-01'),
        entries: [
            'main.ts',
            'nested/main.ts',
            'worker/index.js'
        ],
        staticDirs: ['assets', 'public']
    })

    it('Success bundling typescript and javascript source code input', async () => {
        const result: CubegenBundlerResponse = await bundler.build()

        // check response data.
        const { hashProject, entries, staticDirs } = result
        expect(typeof hashProject).toEqual('string')
        expect(Array.isArray(entries)).toEqual(true)
        expect(Array.isArray(staticDirs)).toEqual(true)
        expect(entries[0]).toHaveProperty('fromEntry')
        expect(entries[0]).toHaveProperty('hash')
        expect(entries[0]).toHaveProperty('buildTime')
        expect(entries[0]).toHaveProperty('sourcePath')
        expect(entries[0]).toHaveProperty('ouputPath')
        expect(staticDirs[0]).toHaveProperty('fromStaticDir')
        expect(staticDirs[0]).toHaveProperty('sourceDirPath')
        expect(staticDirs[0]).toHaveProperty('ouputDirPath')

        // check entry result file exits.
        expect(fs.existsSync(entries[0].ouputPath)).toEqual(true)
        expect(fs.existsSync(entries[1].ouputPath)).toEqual(true)
        expect(fs.existsSync(entries[2].ouputPath)).toEqual(true)

        // check static dir result  exits.
        expect(fs.existsSync(staticDirs[0].ouputDirPath)).toEqual(true)
        expect(fs.existsSync(staticDirs[1].ouputDirPath)).toEqual(true)
    })

    it('Bundling successful to remove comment string', async () => {
        const result: CubegenBundlerResponse = await bundler.build()
        const { entries } = result

        // check main.ts entry.
        const rawBundle1 = fs.readFileSync(entries[0].ouputPath, 'utf8')
        expect(rawBundle1).not.toContain('Main program')

        // check nested/main.ts entry.
        const rawBundle2 = fs.readFileSync(entries[1].ouputPath, 'utf8')
        expect(rawBundle2).not.toContain('Nested program')

        // check worker/index.js entry.
        const rawBundle3 = fs.readFileSync(entries[2].ouputPath, 'utf8')
        expect(rawBundle3).not.toContain('Worker program')
    })

    it('Bundling proses does not change the functionality of the code program', async () => {
        const result: CubegenBundlerResponse = await bundler.build()
        const { entries } = result

        // check main.ts entry.
        const outputSourceCodeEntry1 = execSync(`ts-node ${entries[0].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry1 = execSync(`node ${entries[0].ouputPath}`, { encoding: 'utf-8' })
        expect(outputSourceCodeEntry1).toEqual(outputBundleCodeEntry1)

        // check nested/main.ts entry.
        const outputSourceCodeEntry2 = execSync(`ts-node ${entries[1].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry2 = execSync(`node ${entries[1].ouputPath}`, { encoding: 'utf-8' })
        expect(outputSourceCodeEntry2).toEqual(outputBundleCodeEntry2)

        // check worker/index.js entry.
        const sourceDir3 = path.dirname(entries[2].sourcePath)
        const outputSourceCodeEntry3 = execSync(`cd ${sourceDir3} && node ${entries[2].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry3 = execSync(`node ${entries[2].ouputPath}`, { encoding: 'utf-8' })
        expect(outputSourceCodeEntry3).toEqual(outputBundleCodeEntry3)
    })
})

describe('Test Bundler Result Work for NodeJS Environment', () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(MODULE_PATH_DIR, 'test/examples/node-code'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'out-test-02'),
        entries: [
            'node.js'
        ]
    })

    it('Success maintain argv and write file functionality', async () => {
        const result = await bundler.build()

        // Check argv output.
        const execResult = execSync(`node ${result.entries[0].ouputPath} test_argv`, { encoding: 'utf-8' })
        expect(execResult).toEqual('test_argv\n')

        // Check file created.
        const outFilePath = path.join(process.cwd(), '.cache/node.txt')
        expect(fs.existsSync(outFilePath)).toEqual(true)
    })
})
