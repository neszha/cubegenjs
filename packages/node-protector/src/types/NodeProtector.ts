import { type CubegenBundlerOptions } from '@cubegen/bundler/dist/types/Bundler'
import { type CubegenObfuscatorOptions } from '@cubegen/obfuscator/dist/types/Obfuscator'

export interface CubegenNodeBuilderOptions {
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}
