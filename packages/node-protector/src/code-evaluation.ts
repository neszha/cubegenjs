import fs from 'fs'
import path from 'path'
import event from './utils/event'
import { type CubegenJson } from './types/CobegenJson'
import { type CubegenNodeBuilderOptions } from './types/NodeProtector'
import { createHash } from 'crypto'

const privateKey1: string = '%PRIVATE_KEY_1%'

/**
 * Evaluate source code modified.
 *
 * @return true if source code is modified
 * @return false and send event on source code modified
 */
export const evaluateCodeMofied = (options: CubegenNodeBuilderOptions, privateKey2: string = '%PRIVATE_KEY_2%'): boolean => {
    try {
        // Get signnatures from cubegen-lock.json.
        const lockPath: string = path.join(options.codeBundlingOptions.outDir, 'cubegen-lock.json')
        const cubegenLockJsonString = fs.readFileSync(lockPath, 'utf-8')
        const { signatures } = JSON.parse(cubegenLockJsonString) as CubegenJson

        // Get original signatures from this source code.
        const sourceCodePath = process.argv[1]
        const sourceCodeRaw = fs.readFileSync(sourceCodePath, 'utf-8')
        const sourceCodeHash = createHash('sha256').update(sourceCodeRaw).digest('hex')
        const sourceCodeSignitureContent: string = [privateKey1, privateKey2, sourceCodeHash].join('.')
        const sourceCodeSigniture = createHash('sha512').update(sourceCodeSignitureContent).digest('hex')

        // Comparing signatures.
        for (const signature of signatures) {
            const signatureFromMeta = signature.signature.replace('sha512:', '')
            if (sourceCodeSigniture === signatureFromMeta) return false
        }

        // Modification detected.
        const randomFloat = Math.random()
        if (randomFloat > 0.5) return true
        else event.emit('event:source-code-changed')
        return false
    } catch (error) {
        const randomFloat = Math.random()
        if (randomFloat > 0.5) return true
        else event.emit('event:source-code-changed')
        return false
    }
}
