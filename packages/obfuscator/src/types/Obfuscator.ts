import { type ObfuscatorOptions } from 'javascript-obfuscator'
import { type TargetEnvironment } from '@cubegenjs/common/dist/interfaces/Global'

export type FilePath = string

export type ObfuscatorTargetEnvironment = TargetEnvironment

export interface CubegenObfuscatorOptions extends ObfuscatorOptions {}

export interface CubegenObfuscatorResponse {
    hash: string // SHA256
    outputTempPath: FilePath
    outputCode: string
}
