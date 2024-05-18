import event from './utils/event'
import { evaluate } from './code-evaluation'
import { type CubegenNodeBuilderOptions, type CubegenNodeModificationProtectionOptions, type SyncFunctionCallback } from './types/NodeProtector'

let protectorIsReady: boolean = false
let builderOptions: CubegenNodeBuilderOptions | any = {}

/**
 * Builder Options.
 */
export const setBuilderOptions = (options: CubegenNodeBuilderOptions): void => {
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
        const sourceCodeIsModified = evaluate(builderOptions)
        if (sourceCodeIsModified) callback()
    })

    // Watch callback from event.
    event.on('event:source-code-changed', callback)
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
})()
