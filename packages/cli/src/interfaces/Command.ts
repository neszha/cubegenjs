import { type FilePath } from './Common'
import { type InitorUserInput } from './Initor'

export interface CmdInitOptions {
    root: FilePath
    userInput?: InitorUserInput
}

export interface CmdBuildOptions {
    root: FilePath
}

export interface PackageJson {
    name?: string
    version?: string
    main?: string
    type: string
}
