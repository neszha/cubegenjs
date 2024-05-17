import type { InitialParcelOptions } from '@parcel/types'

export type FilePath = string

export interface PercelOptions extends InitialParcelOptions {
    entries: FilePath | FilePath[]
}

export interface BundlerPackageJson {
    type: 'commonjs' | 'module'
    hideDependencies: boolean
    hideDevDependencies: boolean
}

export interface CubegenBundlerOptions {
    rootDir: FilePath
    outDir: FilePath
    entries: FilePath[] // relative with rootDir
    staticDirs?: FilePath[] // relative with rootDir
    packageJson?: BundlerPackageJson
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
    hashProject: string // SHA256
    entries: CubegenBundlerEntryResponse[]
    staticDirs: CubegenBundlerStaticDirResponse[]
}
