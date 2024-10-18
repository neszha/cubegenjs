import { EventEmitter } from 'events'
import { type WebProtectorIntervalCallOptions, type SyncFunctionCallback, type WebProtectorDomainLockingOptions } from './interfaces/WebProtector'
import state from './state'

/**
 * Initialization event emiter.
 */
const event = new EventEmitter()

/**
 * Web Protector Lifecycle: onStart.
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
 * Web Protector Lifecycle: onDocumentLoaded.
 *
 * Running after DOM loaded.
 */
export const onDocumentLoadedCallbackExecution = (callback: SyncFunctionCallback): void => {
    state.protectorIsReady = true
    if (typeof callback === 'function') {
        event.on('call:on-document-loaded', callback)
    } else {
        throw new Error('Callback is not a function.')
    }
}

/**
 * Web Protector Lifecycles: onDomainNotAllowed.
 *
 * Running after DOM loaded.
 */
export const onDomainNotAllowedCallbackExecution = (options: WebProtectorDomainLockingOptions, callback: SyncFunctionCallback): void => {
    state.protectorIsReady = true

    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') {
        throw new Error('Callback is not a function.')
    }

    // Block lifecycles in development mode.
    if (state.inDevelopmentMode !== 'distributed') return

    // Evaluate allowed domains or site host.
    event.on('exec:on-domain-not-allowed', callback)
    event.on('call:on-domain-not-allowed', () => {
        const siteHostComparation = (): void => {
            const matchs = options.whitlist.map((pattern): boolean => {
                const regex = new RegExp(pattern)
                const match = state.siteHost.match(regex)
                if (match === null) return false
                if (match[0] !== state.siteHost) return false
                return true
            })
            if (!matchs.includes(true)) {
                event.emit('exec:on-domain-not-allowed')
            }
        }
        try {
            const random = Math.random()
            if (random > 0.66) {
                state.siteHost = window.document.location.host
            } else if (random > 0.33) {
                state.siteHost = window.location.host
            } else {
                state.siteHost = document.location.host
            }
            siteHostComparation()
        } catch (error) {
            siteHostComparation()
        }
    })
}

/**
 * Web Protector Lifecycles: onIntervalCall.
 *
 * Lifecycle call every 5 seconds (default).
 */
export const onIntervalCallCallbackExecution = (options: WebProtectorIntervalCallOptions, callback: SyncFunctionCallback): void => {
    state.protectorIsReady = true

    // Validate params.
    if (!options.enabled) return
    if (typeof callback !== 'function') {
        throw new Error('Callback is not a function.')
    }

    // Run event loop.
    event.on('call:on-interval-call', () => {
        state.callIntervalTimeout = setInterval(() => {
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

    // Call onDocumentLoaded and onDomainNotAllowed callback lifecycle.
    const callEvents = (): void => {
        event.emit('call:on-document-loaded')
        setTimeout(() => {
            event.emit('call:on-domain-not-allowed')
        }, 150)
    }
    try {
        const random = Math.random()
        if (random > 0.5) {
            window.document.addEventListener('DOMContentLoaded', () => {
                callEvents()
            })
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                callEvents()
            })
        }
        if (window.document.readyState === 'complete') {
            callEvents()
        }
    } catch (error) {
        setTimeout(() => {
            callEvents()
        }, 150)
    }

    // Run event loop and call onIntervalCall callback lifecycle.
    event.emit('call:on-interval-call')
})()
