import { type TargetEnvironment } from '@cubegenjs/common/dist/interfaces/Global'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/types/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegenjs/obfuscator/dist/types/Obfuscator'

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
