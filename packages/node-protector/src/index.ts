/**
 * Node Protector Interfaces.
 *
 * Handle user configuration to protect NodeJS source code.
 */

import { event as eventEmiter } from './utils/event'
import { type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback } from './types/NodeProtector'
import { onModifiedCallbackEcecution, onStartCallbackEcecution, setBuilderOptions } from './runtime-protector'

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

/**
 * Export untils.
 */
export const event = eventEmiter
export const builder = {
    setBuilderOptions
}

/**
 * Export default.
 */
export default {
    event,
    builder,
    setModificationProtectionOptions,
    onStart,
    onModified
}
