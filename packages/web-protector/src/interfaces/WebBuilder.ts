import { type WebProtectorBuilderOptions } from './WebProtector'
import { type FilePath } from './Common'

export interface BuilderInputOptions {
    rootDir: FilePath
    builderConfig: WebProtectorBuilderOptions
}
