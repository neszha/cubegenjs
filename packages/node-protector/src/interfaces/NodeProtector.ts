import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'

export type SyncFunctionCallback = () => void

export interface NodeProtectorBuilderOptions {
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
