import { type CubegenObfuscatorOptions } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type TargetEnvironment } from './Common'

export type SyncFunctionCallback = () => void

export interface NodeProtectorBuilderOptions {
    appKey: string
    target: TargetEnvironment
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}

export interface NodeProtectorModifiedCodeOptions {
    enabled: boolean
}

export interface NodeProtectorIntervalCallOptions {
    enabled: boolean
    eventLoopInterval?: number // in milliseconds (5000 miliseconds by default)
}
