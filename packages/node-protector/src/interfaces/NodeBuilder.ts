import { type FilePath } from './Common'
import { type NodeProtectorBuilderOptions } from './NodeProtector'

export interface BuilderInputOptions {
    rootDir: FilePath
    builderConfig: NodeProtectorBuilderOptions
}
