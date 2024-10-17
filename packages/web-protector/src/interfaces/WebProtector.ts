import { type CubegenObfuscatorOptions } from '@cubegenjs/obfuscator/dist/interfaces/Obfuscator'
import { type TargetEnvironment } from './Common'

export type SyncFunctionCallback = () => void

export interface WebProtectorBuilderOptions {
    appKey: string
    target: TargetEnvironment
    buildCommand: string
    codeObfuscationOptions: CubegenObfuscatorOptions
}

export interface WebProtectorDomainLockingOptions {
    enabled: boolean
}

export interface WebProtectorIntervalCallOptions {
    enabled: boolean
    eventLoopInterval?: number // in milliseconds (5000 miliseconds by default)
}
