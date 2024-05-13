import { type ObfuscatorOptions } from 'javascript-obfuscator'

export type FilePath = string

export interface CubegenObfuscatorOptions extends ObfuscatorOptions {}

export interface CubegenObfuscatorResponse {
    hash: string // SHA256
    outputTempPath: FilePath
    outputCode: string
}
