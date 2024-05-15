import { type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback } from './types/NodeProtector'

/**
 * Node Protector Lifecycles: onStart.
 *
 * Running after runtime protector starting.
 */
export const onStartCallbackEcecution = (callback: SyncFunctionCallback): void => {
    if (typeof callback === 'function') {
        callback()
    }
}

/**
 * Node Protector Lifecycles: onModified.
 *
 * Running after runtime protector starting.
 */
export const onModifiedCallbackEcecution = (options: CubegenNodeModificationProtectionOptions, callback: SyncFunctionCallback): void => {
    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') return

    // Run callback.
    callback()
}
