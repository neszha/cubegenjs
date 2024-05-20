import event from './event'
import { evaluateCodeMofied } from './code-evaluation'
import { type NodeProtectorBuilderOptions, type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback, type NodeProtectorEventLoopOptions } from '../interfaces/NodeProtector'

let protectorIsReady: boolean = false
let builderOptions: NodeProtectorBuilderOptions | any = {}

/**
 * Builder Options.
 */
export const setBuilderOptions = (options: NodeProtectorBuilderOptions): void => {
    builderOptions = {
        ...builderOptions,
        ...options
    }
}

/**
 * Node Protector Lifecycles: onStart.
 *
 * Running after runtime protector starting.
 */
export const onStartCallbackEcecution = (callback: SyncFunctionCallback): void => {
    protectorIsReady = true
    if (typeof callback === 'function') {
        event.on('call:on-start', callback)
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

    // Run evaluate source code process.
    event.on('call:on-midified', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const sourceCodeIsModified = evaluateCodeMofied(builderOptions)
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
export const onIntervalCallCallbackEcecution = (options: NodeProtectorEventLoopOptions, callback: SyncFunctionCallback): void => {
    protectorIsReady = true

    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') return

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

    // Show builder options for builder tools.
    if (process.argv[2] === '--get-options') {
        console.log(JSON.stringify(builderOptions))
        return
    }

    // Call onStart lifecycle.
    event.emit('call:on-start')

    // Call onModified lifecycle.
    event.emit('call:on-midified')

    // Run event loop.
    event.emit('call:on-interval-call')
})()
