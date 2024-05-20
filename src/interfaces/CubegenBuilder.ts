import { type FilePath } from '@cubegenjs/common/dist/interfaces/Global'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/dist/interfaces/NodeProtector'

export type CubgenBuilderOptions = NodeProtectorBuilderOptions

export interface NodeProtectorBuilderCacheOptions {
    rootProject: FilePath
    protector: {
        fileName: string
        bundledPath: FilePath
        backupBundledPath?: FilePath
    }
}
