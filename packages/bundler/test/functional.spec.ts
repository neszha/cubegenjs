import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import { CubegenBundler } from '../src/index'
import { type CubegenBundlerOptions, type CubegenBundlerResponse } from '../src/interfaces/Bundler'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_TEMP_PATH_DIR = path.join(MODULE_PATH_DIR, '.test-temp')

describe('Test Class Cubegen Bundler Module', () => {
    const bundlerOptions: CubegenBundlerOptions = {
        rootDir: path.resolve(MODULE_PATH_DIR, 'test/examples/source-code'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'out-test-01'),
        entries: [
            'main.ts',
            'nested/main.ts',
            'worker/index.js'
        ],
        staticDirs: ['assets', 'public']
    }

    it('Success initialize bundler class', () => {
        const bundler = new CubegenBundler(bundlerOptions)

        // Check class object properties.
        expect(bundler).toHaveProperty('inputOptions')
        expect(bundler).toHaveProperty('percelOptions')
        expect(bundler).toHaveProperty('getInputOptions')
        expect(bundler).toHaveProperty('setConstomInputOptions')
        expect(bundler).toHaveProperty('build')
    })

    it('Success custom input options', () => {
        const bundler = new CubegenBundler(bundlerOptions)
        const originalInputOptions = bundler.getInputOptions()
        bundler.setConstomInputOptions({
            buildMode: 'development'
        })
        const newInputOptions = bundler.getInputOptions()
        expect(originalInputOptions).not.toEqual(newInputOptions)
    })

    it('Success build project to distribution project', async () => {
        const bundler = new CubegenBundler(bundlerOptions)
        const result: CubegenBundlerResponse = await bundler.build()

        // Check response data.
        const { hash, entries, staticDirs } = result
        expect(hash).toContain('sha256:')
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

        // Check packages.json output.
        const packageJsonPath = path.join(bundlerOptions.outDir, 'package.json')
        expect(fs.existsSync(packageJsonPath)).toEqual(true)
    })
})

describe('Test Output Project Bundler Module', () => {
    const bundlerOptions: CubegenBundlerOptions = {
        rootDir: path.resolve(MODULE_PATH_DIR, 'test/examples/source-code'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'out-test-02'),
        entries: [
            'main.ts',
            'nested/main.ts',
            'worker/index.js'
        ],
        staticDirs: ['assets', 'public']
    }
    const bundler = new CubegenBundler(bundlerOptions)
    const inputOptions = bundler.getInputOptions()

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
        const outputBundleCodeEntry1 = execSync('node main.js', {
            cwd: inputOptions.outDir,
            encoding: 'utf-8'
        })
        expect(outputSourceCodeEntry1).toEqual(outputBundleCodeEntry1)

        // check nested/main.ts entry.
        const outputSourceCodeEntry2 = execSync(`ts-node ${entries[1].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry2 = execSync('node nested/main.js', {
            cwd: inputOptions.outDir,
            encoding: 'utf-8'
        })
        expect(outputSourceCodeEntry2).toEqual(outputBundleCodeEntry2)

        // check worker/index.js entry.
        const sourceDir3 = path.dirname(entries[2].sourcePath)
        const outputSourceCodeEntry3 = execSync(`cd ${sourceDir3} && node ${entries[2].sourcePath}`, { encoding: 'utf-8' })
        const outputBundleCodeEntry3 = execSync('node worker/index.js', {
            cwd: inputOptions.outDir,
            encoding: 'utf-8'
        })
        expect(outputSourceCodeEntry3).toEqual(outputBundleCodeEntry3)
    })
})

describe('Test Bundler Result Work Running with NodeJS Engine', () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(MODULE_PATH_DIR, 'test/examples/node-code'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'out-test-03'),
        entries: [
            'argv.js',
            'file-system.js'
        ],
        staticDirs: [
            'data'
        ]
    })
    const inputOptions = bundler.getInputOptions()

    it('Success use argv function', async () => {
        await bundler.build()

        // Check exec output.
        const execResult = execSync('node argv.js test_argv', {
            cwd: inputOptions.outDir,
            encoding: 'utf-8'
        })
        expect(execResult).toEqual('test_argv\n')
    })

    it('Success use file-system function', async () => {
        await bundler.build()

        // Check exec output.
        const execResult = execSync('node file-system.js', {
            cwd: inputOptions.outDir,
            encoding: 'utf-8'
        })
        expect(execResult).toEqual('Hello, World!\n')
    })
})
