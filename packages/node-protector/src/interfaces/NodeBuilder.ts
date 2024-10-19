import { type NodeProtectorBuilderOptions } from './NodeProtector'
import { type FilePath } from './Common'

export interface BuilderInputOptions {
    rootDir: FilePath
    builderConfig: NodeProtectorBuilderOptions
}
