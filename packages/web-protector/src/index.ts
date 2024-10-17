/**
 * Node Protector Lifecycle Interfaces.
 *
 * Handle user custom configuration to protect web code.
 */

import { type WebProtectorDomainLockingOptions, type SyncFunctionCallback, type WebProtectorIntervalCallOptions } from './interfaces/WebProtector'
import { onIntervalCallCallbackExecution, onStartCallbackExecution } from './runtime-protector'

/**
 * Node Protector Lifecycles.
 */
export const onStart = (callback: SyncFunctionCallback): void => {
    onStartCallbackExecution(callback)
}

export const onDocumentLoaded = (callback: SyncFunctionCallback): void => {
    //
}

export const onDomainNotAllowed = (options: WebProtectorDomainLockingOptions, callback: SyncFunctionCallback): void => {
    //
}

export const onIntervalCall = (options: WebProtectorIntervalCallOptions, callback: SyncFunctionCallback): void => {
    onIntervalCallCallbackExecution(options, callback)
}
