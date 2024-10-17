import { type Subscriber } from 'rxjs'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/dist/interfaces/NodeProtector'
import { type WebProtectorBuilderOptions } from '@cubegenjs/web-protector/src/interfaces/WebProtector'
import { type FilePath } from '@cubegenjs/cli/src/interfaces/Common'

export type CubegenBuilderOptions = NodeProtectorBuilderOptions | WebProtectorBuilderOptions

export interface NodeBuilderInputOptions {
    rootDir: FilePath
    builderConfig: NodeProtectorBuilderOptions
    observer: Subscriber<unknown>
}

export interface WebBuilderInputOptions {
    rootDir: FilePath
    builderConfig: WebProtectorBuilderOptions
    observer: Subscriber<unknown>
}
