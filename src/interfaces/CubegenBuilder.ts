import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/dist/interfaces/NodeProtector'
import { type FilePath } from './Common'

export type CubgenBuilderOptions = NodeProtectorBuilderOptions

export interface NodeProtectorBuilderCacheOptions {
    rootProject: FilePath
    protector: {
        fileName: string
        bundledPath: FilePath
        backupBundledPath?: FilePath
    }
}
