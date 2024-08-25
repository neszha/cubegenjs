import { type CubegenObfuscatorOptions } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type CubegenBundlerOptions } from '@cubegenjs/bundler/dist/interfaces/Bundler'
import { type TargetEnvironment } from './Common'

export interface NodeBuilderOptions {
    appKey: string
    target: TargetEnvironment
    codeBundlingOptions: CubegenBundlerOptions
    codeObfuscationOptions: CubegenObfuscatorOptions
}
