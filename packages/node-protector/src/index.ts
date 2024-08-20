/**
 * Node Protector Lifecycle Interfaces.
 *
 * Handle user custom configuration to protect NodeJS source code.
 */

import { type NodeProtectorIntervalCallOptions, type SyncFunctionCallback, type NodeProtectorModifiedCodeOptions } from './interfaces/NodeProtector'
import { onIntervalCallCallbackExecution, onModifiedCodeCallbackExecution, onStartCallbackExecution } from './runtime-protector'

/**
 * Node Protector Lifecycles.
 */
export const onStart = (callback: SyncFunctionCallback): void => {
    onStartCallbackExecution(callback)
}

export const onModifiedCode = (options: NodeProtectorModifiedCodeOptions, callback: SyncFunctionCallback): void => {
    onModifiedCodeCallbackExecution(options, callback)
}

export const onIntervalCall = (options: NodeProtectorIntervalCallOptions, callback: SyncFunctionCallback): void => {
    onIntervalCallCallbackExecution(options, callback)
}
