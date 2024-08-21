import type { InitialParcelOptions } from '@parcel/types'
import { type BuildMode, type FilePath } from './Common'

export interface PercelOptions extends InitialParcelOptions {
    entries: FilePath | FilePath[]
}

export interface CubegenBundlerOptions {
    rootDir: FilePath
    outDir: FilePath
    entries: FilePath[] // relative with rootDir
    staticDirs?: FilePath[] // relative with rootDir
    buildMode?: BuildMode
}

export interface CustomCubegenBundlerOptions {
    buildMode?: BuildMode
}

export interface CubegenBundlerEntryResponse {
    fromEntry: string
    hash: string // SHA256
    buildTime: number // in ms
    sourcePath: FilePath
    ouputPath: FilePath
}

export interface CubegenBundlerStaticDirResponse {
    fromStaticDir: string
    sourceDirPath: FilePath
    ouputDirPath: FilePath
}

export interface CubegenBundlerResponse {
    hash: string // SHA256
    entries: CubegenBundlerEntryResponse[]
    staticDirs: CubegenBundlerStaticDirResponse[]
}
