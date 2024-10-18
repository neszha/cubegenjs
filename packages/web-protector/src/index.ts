/**
 * Node Protector Lifecycle Interfaces.
 *
 * Handle user custom configuration to protect web code.
 */

import { onDocumentLoadedCallbackExecution, onDomainNotAllowedCallbackExecution, onIntervalCallCallbackExecution, onStartCallbackExecution } from './runtime-protector'
import { type WebProtectorDomainLockingOptions, type SyncFunctionCallback, type WebProtectorIntervalCallOptions } from './interfaces/WebProtector'
import state from './state'

/**
 * Node Protector Lifecycles.
 */
export const onStart = (callback: SyncFunctionCallback): void => {
    onStartCallbackExecution(callback)
}

export const onDocumentLoaded = (callback: SyncFunctionCallback): void => {
    onDocumentLoadedCallbackExecution(callback)
}

export const onDomainNotAllowed = (options: WebProtectorDomainLockingOptions, callback: SyncFunctionCallback): void => {
    onDomainNotAllowedCallbackExecution(options, callback)
}

export const onIntervalCall = (options: WebProtectorIntervalCallOptions, callback: SyncFunctionCallback): void => {
    onIntervalCallCallbackExecution(options, callback)
}

/**
 * State.
 */
export const customState = state
