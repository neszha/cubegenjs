import path from 'path'
import fs from 'fs-extra'
import { CubegenObfuscator } from '../src/index'

const MODULE_PATH_DIR = path.resolve(__dirname, '../')
const algoSourceDir = path.join(MODULE_PATH_DIR, 'test/examples/algo-sources')
const sourceFileNames = [
    'aes.js',
    'base64.js',
    'md5.js',
    'sha256.js'
]

describe('Test Source Code Indentifier Comparison Bundler Module', () => {
    it('Calculate indentifier comparison.', async () => {
        // Skip test because it is slow to run.
        if (process.env.NODE_ENV === 'test') {
            // Comment this block to run complete test.
            return
        }

        // Calculate indentifier comparison.
        const result: any[] = []
        for (const sourceFileName of sourceFileNames) {
            // Get file content.
            const filePath = path.join(algoSourceDir, sourceFileName)
            const fileContent = await fs.readFile(filePath, 'utf8')

            // Count identifier in original file.
            const regexPattern = /\b(?:(?:[a-zA-Z]{3,}\d*)|\d{3,})\b/g
            const originalIdentifiers = fileContent.match(regexPattern)
            const uniqueOriginalIdentifiers = [...new Set(originalIdentifiers)]
            const totalOriginalIdentifiers = uniqueOriginalIdentifiers.length

            // Obfuscate file content.
            const obfuscator = new CubegenObfuscator(filePath)
            obfuscator.setCustomConfig({
                seed: '1234567890'
            })
            const obfuscateResult = obfuscator.transform()

            // Count identifier in obfuscate file.
            let identifierFound = 0
            for (const identifier of uniqueOriginalIdentifiers) {
                if (obfuscateResult.outputCode.includes(identifier)) {
                    identifierFound++
                }
            }

            // Add to result.
            result.push({
                sourceFileName,
                totalOriginalIdentifiers,
                identifierFound
            })
        }

        // Show data.
        console.table(result)
    }, 60_000)
})
