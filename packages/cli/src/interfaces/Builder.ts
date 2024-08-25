import { type Subscriber } from 'rxjs'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/dist/interfaces/NodeProtector'
import { type FilePath } from '@cubegenjs/cli/src/interfaces/Common'

export type CubegenBuilderOptions = NodeProtectorBuilderOptions

export interface NodeBuilderInputOptions {
    rootDir: FilePath
    builderConfig: NodeProtectorBuilderOptions
    observer: Subscriber<unknown>
}
