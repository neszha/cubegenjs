import EventEmitter from 'events'
import { type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback } from './types/NodeProtector'

let protectorIsReady: boolean = false

/**
 * Initialize event emitter.
 */
export const event = new EventEmitter()

/**
 * Node Protector Lifecycles: onStart.
 *
 * Running after runtime protector starting.
 */
export const onStartCallbackEcecution = (callback: SyncFunctionCallback): void => {
    protectorIsReady = true
    if (typeof callback === 'function') {
        event.on('start', callback)
    }
}

/**
 * Node Protector Lifecycles: onModified.
 *
 * Running after runtime protector starting.
 */
export const onModifiedCallbackEcecution = (options: CubegenNodeModificationProtectionOptions, callback: SyncFunctionCallback): void => {
    protectorIsReady = true

    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') return

    // Run callback.
    event.on('modified', () => {
        callback()
    })
}

/**
 * Runtime Protector.
 */
void (async () => {
    // Waiting lifesycles is ready.
    await new Promise((resolve): void => {
        // Check until protector is ready.
        const interval = setInterval((): void => {
            if (protectorIsReady) {
                clearInterval(interval)
                clearTimeout(timeout)
                resolve(undefined)
            }
        }, 256)

        // Timeout cheking.
        const timeout = setTimeout((): void => {
            clearInterval(interval)
            clearTimeout(timeout)
            resolve(undefined)
        }, 2500)
    })

    // Call onStart lifecycle.
    event.emit('start')

    // Call onModified lifecycle.
    event.emit('modified')

    // Run event loop.
})()
