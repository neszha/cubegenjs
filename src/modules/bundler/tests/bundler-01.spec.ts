import path from 'path'
import { CubegenBundler } from '../bundler'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_TEMP_PATH_DIR = path.resolve(MODULE_PATH_DIR, '.cubegen')

describe('Test Bundler Module: test-source-code-01', () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(MODULE_PATH_DIR, 'tests/test-source-code-01'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'test-dist-01'),
        entries: [
            'main.ts',
            'nested/main.ts'
        ]
    })

    it('Success bundling typescript source code', async () => {
        await bundler.build()
    })
})
