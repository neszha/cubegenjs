import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'
import type EventEmitter from 'events'
import { type CubegenJson } from './interfaces/CobegenJson'
import state from './state'

/**
 * Evaluate source code modified.
 *
 * @return true if source code is modified
 * @return false and send event on source code modified
 */
export const evaluateCodeAsSignature = (event: EventEmitter, privateKey02: string = '%PRIVATE_KEY_02%'): boolean => {
    try {
        // Get signatures from cubegen-lock.json.
        const cubegenLockPath: string = path.join(process.cwd(), 'cubegen-lock.json')
        if (!fs.existsSync(cubegenLockPath)) {
            throw new Error('Error when reading cubegen-lock.json in root directory.')
        }
        const cubegenLockJsonString = fs.readFileSync(cubegenLockPath, 'utf-8')
        const { signatures } = JSON.parse(cubegenLockJsonString) as CubegenJson

        // Get original signatures from this source code.
        const privateKey03 = '%PRIVATE_KEY_03%'
        const sourceCodePath = process.argv[1]
        const sourceCodeRaw = fs.readFileSync(sourceCodePath, 'utf-8')
        const sourceCodeHash = createHash('sha256').update(sourceCodeRaw).digest('hex')
        const privateKeys = [state.privateKey01, privateKey02, privateKey03].join('.')
        const sourceCodeSignitureContent: string = [privateKeys, sourceCodeHash].join('.')
        const sourceCodeSigniture = createHash('sha512').update(sourceCodeSignitureContent).digest('hex')

        // Comparing signatures.
        for (const signature of signatures) {
            const signatureFromMeta = signature.signature.replace('sha512:', '')
            if (sourceCodeSigniture === signatureFromMeta) return false
        }

        // Code Modification detected.
        const randomFloat = Math.random()
        if (randomFloat > 0.5) return true
        else event.emit('event:source-code-changed') // Alternative callback via event.
        return false
    } catch (error) {
        // If validate signatures is error.
        const randomFloat = Math.random()
        if (randomFloat > 0.5) return true
        else event.emit('event:source-code-changed') // Alternative callback via event.
        return false
    }
}
