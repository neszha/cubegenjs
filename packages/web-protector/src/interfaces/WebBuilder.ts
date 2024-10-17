import { type FilePath } from './Common'
import { type WebProtectorBuilderOptions } from './WebProtector'

export interface BuilderInputOptions {
    rootDir: FilePath
    builderConfig: WebProtectorBuilderOptions
}
