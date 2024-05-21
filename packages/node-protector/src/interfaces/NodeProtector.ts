import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type TargetEnvironment } from './Common'

export type SyncFunctionCallback = () => void

export interface NodeProtectorBuilderOptions {
    targetEnvironment: TargetEnvironment
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}

export interface CubegenNodeModificationProtectionOptions {
    enabled: boolean
}

export interface NodeProtectorEventLoopOptions {
    enabled: boolean
    eventLoopInterval: number // in milliseconds (5000 miliseconds by default)
}
