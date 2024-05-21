import { type ObfuscatorOptions } from 'javascript-obfuscator'
import { type TargetEnvironment, type FilePath } from './Common'

export type ObfuscatorTargetEnvironment = TargetEnvironment

export interface CubegenObfuscatorOptions extends ObfuscatorOptions {}

export interface CubegenObfuscatorResponse {
    hash: string // SHA256
    outputTempPath: FilePath
    outputCode: string
}
