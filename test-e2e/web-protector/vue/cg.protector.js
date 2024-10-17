/**
 * You mush build cubegen config with command `npx cubegen build`.
 * The build process will generate "cg.protector.obfus.js" file in the project root.
 * Import this file in your project.
 *
 * For example: `import 'cg.protector.obfus.js'` in file index.js
 */
import { onStart, onDocumentLoaded, onDomainNotAllowed, onIntervalCall } from '@cubegenjs/web-protector'

/**
 * Exec after protector is started.
 */
onStart(() => {
    console.log('Runtime protector is starting.')
})

/**
 * Exec after protector is started.
 */
onDocumentLoaded(() => {
    // console.log('Document is loaded.')
})

/**
 * Domain locking.
 *
 * Set enable to true to enable domain locking.
 * In development mode, the onModifiedCode lifecycle is not called.
 */
const domainLockingOptions = {
    enabled: false
}
onDomainNotAllowed(domainLockingOptions, () => {
    // console.log('Domain is not allowed.')
    // window.location.href = 'https://google.com'
})

/**
 * Event loop call interval.
 *
 * Set enable to true to enable event loop.
 */
const intervalCallOptions = {
    enabled: false,
    eventLoopInterval: 5000 // in miliseconds.
}
onIntervalCall(intervalCallOptions, () => {
    // console.log('Interval call.')
})
