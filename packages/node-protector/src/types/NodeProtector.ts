import { type CubegenBundlerOptions } from '@cubegen/bundler/dist/types/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegen/obfuscator/dist/types/Obfuscator'
import { type TargetEnvironment } from '../enums/NodeProtectorEnum'

export type SyncFunctionCallback = () => void

export interface CubegenNodeBuilderOptions {
    targetEnvironment: TargetEnvironment
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}

export interface CubegenNodeModificationProtectionOptions {
    enabled: boolean
}
