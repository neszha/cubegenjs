import path from 'path'
import fs from 'fs-extra'
import { CubegenObfuscator } from '../src/index'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const sampleTestAesPath = path.join(MODULE_PATH_DIR, 'test/examples/aes.sample-test.js')
const sampleTestMd5Path = path.join(MODULE_PATH_DIR, 'test/examples/md5.sample-test.js')
const sampleTestHelloWordPath = path.join(MODULE_PATH_DIR, 'test/examples/hello-word.sample-test.js')

describe('Test Compression Bundler Module', () => {
    it('Calculate compression ratio.', async () => {
        // Skip test because it is slow to run.
        if (process.env.NODE_ENV === 'test') {
            // Comment this block to run complete test.
            return
        }

        // Calculate compression ratio.
        const obfuscator1 = new CubegenObfuscator(sampleTestHelloWordPath)
        const obfuscator2 = new CubegenObfuscator(sampleTestAesPath)
        const obfuscator3 = new CubegenObfuscator(sampleTestAesPath)
        const result1 = obfuscator1.transform()
        const result2 = obfuscator2.transform()
        const result3 = obfuscator3.transform()

        const compressionData: any[] = []

        // Calculate file size result 1.
        const sourceFileSize1 = fs.statSync(sampleTestHelloWordPath).size
        const outputFileSize1 = fs.statSync(result1.outputTempPath).size
        const compressionRatio1 = outputFileSize1 / sourceFileSize1
        compressionData.push({
            Entry: 'hello-word.sample-test.js',
            'Source Size (Bytes)': sourceFileSize1,
            'Output Size (Bytes)': outputFileSize1,
            'Compression Ratio': compressionRatio1
        })

        // Calculate file size result 2.
        const sourceFileSize2 = fs.statSync(sampleTestAesPath).size
        const outputFileSize2 = fs.statSync(result2.outputTempPath).size
        const compressionRatio2 = outputFileSize2 / sourceFileSize2
        compressionData.push({
            Entry: 'aes.sample-test.js',
            'Source Size (Bytes)': sourceFileSize2,
            'Output Size (Bytes)': outputFileSize2,
            'Compression Ratio': compressionRatio2
        })

        // Calculate file size result 3.
        const sourceFileSize3 = fs.statSync(sampleTestMd5Path).size
        const outputFileSize3 = fs.statSync(result3.outputTempPath).size
        const compressionRatio3 = outputFileSize3 / sourceFileSize3
        compressionData.push({
            Entry: 'md5.sample-test.js',
            'Source Size (Bytes)': sourceFileSize3,
            'Output Size (Bytes)': outputFileSize3,
            'Compression Ratio': compressionRatio3
        })

        // Show data.
        console.table(compressionData)
    })
})
