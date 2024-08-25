import { type FilePath } from '@cubegenjs/cli_test/src/interfaces/Common'
import { type InitorUserInput } from '@cubegenjs/cli_test/src/interfaces/Initor'

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
