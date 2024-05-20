import { type TargetEnvironment } from '@cubegen/common/dist/interfaces/Global'
import { type CubegenBundlerOptions } from '@cubegen/bundler/dist/types/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegen/obfuscator/dist/types/Obfuscator'

export type SyncFunctionCallback = () => void

export interface NodeProtectorBuilderOptions {
    targetEnvironment: TargetEnvironment
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}

export interface CubegenNodeModificationProtectionOptions {
    enabled: boolean
}
