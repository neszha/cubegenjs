import type { InitialParcelOptions } from '@parcel/types'

export interface PercelOptions extends InitialParcelOptions {
    entries: string | string[]
}

export interface CubegenBundlerOptions {
    rootDir: string
    outDir: string
    entries: string[] // relative with rootDir
    staticDirs?: string[] // relative with rootDir
}

export interface CubegenBundlerResponseData {
    fromEntry: string
    hash: string // SHA256
    buildTime: number // in ms
    sourcePath: string
    ouputPath: string
}
