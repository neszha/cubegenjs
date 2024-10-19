import path from 'path'
import fs from 'fs-extra'
import { type CubegenBundlerResponse } from '../src/interfaces/Bundler'
import { CubegenBundler } from '../src/index'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const MODULE_TEMP_PATH_DIR = path.join(MODULE_PATH_DIR, '.test-temp')

describe('Test Compression Bundler Module', () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(MODULE_PATH_DIR, 'test/examples/algorithms'),
        outDir: path.resolve(MODULE_TEMP_PATH_DIR, 'out-test-04'),
        entries: [
            'aes.sample-test.js',
            'md5.sample-test.js'
        ]
    })

    it('Calculate compression ratio.', async () => {
        const result: CubegenBundlerResponse = await bundler.build()

        // Calculate file size.
        const compressionData: any[] = []
        for (const item of result.entries) {
            // Get file size.
            const sourceFileSize = fs.statSync(item.sourcePath).size
            const outputFileSize = fs.statSync(item.ouputPath).size
            const compressionRatio = outputFileSize / sourceFileSize
            compressionData.push({
                Entry: item.fromEntry,
                'Source Size (Bytes)': sourceFileSize,
                'Output Size (Bytes)': outputFileSize,
                'Compression Ratio': compressionRatio
            })

            // Comparing.
            expect(outputFileSize < sourceFileSize).toEqual(true)
        }

        // Show data.
        console.table(compressionData)
    })
})
