import { type CubegenBundlerOptions } from '@cubegen/bundler/dist/types/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegen/obfuscator/dist/types/Obfuscator'

export type SyncFunctionCallback = () => void

export enum TargetEnvironment {
    NODE = 'NODE',
    BROWSER = 'BROWSER'
}

export interface CubegenNodeBuilderOptions {
    targetEnvironment: TargetEnvironment
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}

export interface CubegenNodeModificationProtectionOptions {
    enabled: boolean
}
