/**
 * Node Protector Interfaces.
 *
 * Handle user configuration to protect NodeJS source code.
 */

import { event as EventEmitter, onModifiedCallbackEcecution, onStartCallbackEcecution } from './runtime-protector'
import { type CubegenNodeModificationProtectionOptions, type CubegenNodeBuilderOptions, type SyncFunctionCallback } from './types/NodeProtector'

export const event = EventEmitter

/**
 * Builder Options.
 */
let builderOptions: CubegenNodeBuilderOptions
export const setBuilderOptions = (options: CubegenNodeBuilderOptions): void => {
    builderOptions = {
        ...builderOptions,
        ...options
    }
}

/**
 * Node Protector: Modification protection.
 */
let modificationProtectionOptions: CubegenNodeModificationProtectionOptions
export const setModificationProtectionOptions = (options: CubegenNodeModificationProtectionOptions): void => {
    modificationProtectionOptions = {
        ...modificationProtectionOptions,
        ...options
    }
}

/**
 * Node Protector Lifecycles.
 */
export const onStart = (callback: SyncFunctionCallback): void => {
    onStartCallbackEcecution(callback)
}

export const onModified = (callback: SyncFunctionCallback): void => {
    onModifiedCallbackEcecution(modificationProtectionOptions, callback)
}
