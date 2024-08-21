import EventEmitter from 'events'
import { type NodeProtectorModifiedCodeOptions, type NodeProtectorIntervalCallOptions, type SyncFunctionCallback } from './interfaces/NodeProtector'
import { evaluateCodeAsSignature } from './code-evaluation'
import state from './state'

/**
 * Initialization event emiter.
 */
const event = new EventEmitter()

/**
 * Node Protector Lifecycle: onStart.
 *
 * Running after runtime protector starting.
 */
export const onStartCallbackExecution = (callback: SyncFunctionCallback): void => {
    state.protectorIsReady = true
    if (typeof callback === 'function') {
        event.on('call:on-start', callback)
    } else {
        throw new Error('Callback is not a function.')
    }
}

/**
 * Node Protector Lifecycles: onModifiedCode.
 *
 * Running after runtime protector starting.
 */
export const onModifiedCodeCallbackExecution = (options: NodeProtectorModifiedCodeOptions, callback: SyncFunctionCallback): void => {
    state.protectorIsReady = true

    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') {
        throw new Error('Callback is not a function.')
    }

    // Block lifecycles in development mode.
    if (state.inDevelopmentMode !== 'distributed') return

    // Run evaluate source code process.
    event.on('call:on-modified-code', () => {
        const sourceCodeIsModified = evaluateCodeAsSignature(event)
        if (sourceCodeIsModified) callback()
    })

    // Watch callback from event.
    event.on('event:source-code-changed', callback)
}

/**
 * Node Protector Lifecycles: onIntervalCall.
 *
 * Lifecycle call every 5 seconds (default).
 */
export const onIntervalCallCallbackExecution = (options: NodeProtectorIntervalCallOptions, callback: SyncFunctionCallback): void => {
    state.protectorIsReady = true

    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') {
        throw new Error('Callback is not a function.')
    }

    // Run event loop.
    event.on('call:on-interval-call', () => {
        setInterval(() => {
            event.emit('event:interval-call')
        }, options.eventLoopInterval ?? 5000)
    })

    // Watch callback from event.
    event.on('event:interval-call', callback)
}

/**
 * Runtime Protector.
 */
void (async () => {
    // Waiting one of lifesycles is ready.
    await new Promise((resolve): void => {
        // Check until protector is ready.
        const interval = setInterval((): void => {
            if (state.protectorIsReady) {
                clearInterval(interval)
                resolve(true)
            }
        }, 100)
    })

    // Call onStart callback lifecycle.
    event.emit('call:on-start')

    // Call onModifiedCode callback lifecycle.
    event.emit('call:on-modified-code')

    // Run event loop and call onIntervalCall callback lifecycle.
    event.emit('call:on-interval-call')
})()
