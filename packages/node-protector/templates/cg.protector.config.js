/**
 * You mush import this file in your project.
 *
 * For example: `import 'cg.protector.js'` in file index.js
 */
import { onStart, onModifiedCode, onIntervalCall } from '@cubegenjs/node-protector'

/**
 * Exec after protector is started.
 */
onStart(() => {
    // console.log('Runtime protector is starting.')
})

/**
 * Code Modification Protection.
 *
 * Set enable to true to enable modification protection.
 * In development mode, the onModifiedCode lifecycle is not called.
 */
const modifiedCodeOptions = {
    enabled: false
}
onModifiedCode(modifiedCodeOptions, () => {
    // console.log('Source code is changed.')
    // process.exit()
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
