/**
 * Node Protector Interfaces.
 *
 * Handle user configuration to protect NodeJS source code.
 */

import { type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback } from './types/NodeProtector'
import { event as EventEmitter, onModifiedCallbackEcecution, onStartCallbackEcecution, setBuilderOptions } from './runtime-protector'

export const event = EventEmitter
export const builder = {
    setBuilderOptions
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
