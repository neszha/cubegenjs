/**
 * Node Protector Interfaces.
 *
 * Handle user configuration to protect NodeJS source code.
 */

import { event as eventEmiter } from './protector/event'
import { type NodeProtectorEventLoopOptions, type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback } from './interfaces/NodeProtector'
import { onIntervalCallCallbackEcecution, onModifiedCallbackEcecution, onStartCallbackEcecution, setBuilderOptions } from './protector/runtime-protector'

/**
 * Node Protector: Modification protection options interface.
 */
let modificationProtectionOptions: CubegenNodeModificationProtectionOptions
export const setModificationProtectionOptions = (options: CubegenNodeModificationProtectionOptions): void => {
    modificationProtectionOptions = {
        ...modificationProtectionOptions,
        ...options
    }
}

/**
 * Node Protector: Event loop options interface.
 */
let eventLoopOptions: NodeProtectorEventLoopOptions
export const setEventLoopOptions = (options: NodeProtectorEventLoopOptions): void => {
    eventLoopOptions = {
        ...eventLoopOptions,
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

export const onIntervalCall = (callback: SyncFunctionCallback): void => {
    onIntervalCallCallbackEcecution(eventLoopOptions, callback)
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
    setEventLoopOptions,
    onStart,
    onModified
}
