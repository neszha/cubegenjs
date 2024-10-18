/**
 * You mush import this file in your project.
 *
 * For example: `import 'cg.protector.js'` in file index.js
 */
import { onStart, onDocumentLoaded, onDomainNotAllowed, onIntervalCall } from '@cubegenjs/web-protector'

/**
 * Exec after protector is started.
 */
onStart(() => {
    console.log('Runtime protector is starting.')
})

/**
 * Exec after DOM loaded.
 */
onDocumentLoaded(() => {
    console.log('Document is loaded.')
})

/**
 * Domain locking.
 *
 * Set enabled to `true` to use domain locking.
 * In development mode, the onDomainNotAllowed lifecycle is not called.
 */
const domainLockingOptions = {
    enabled: true,
    whitlist: [
        'localhost',
        'localhost:\\d+', // Comment this for test.
        '127.0.0.1:\\d+'
    ]
}
onDomainNotAllowed(domainLockingOptions, () => {
    setTimeout(() => {
        alert('Domain is not allowed.')
        window.location.href = 'https://google.com'
    }, 2000)
})

/**
 * Event loop call interval.
 *
 * Set enabled to `true` to use event loop.
 */
const intervalCallOptions = {
    enabled: true,
    eventLoopInterval: 1000 // in miliseconds.
}
onIntervalCall(intervalCallOptions, () => {
    console.log('Interval call.')
})
