import {
    builder,
    setModificationProtectionOptions,
    setEventLoopOptions,
    onStart,
    onModified,
    onIntervalCall
} from '@cubegenjs/node-protector'

/**
 * Builder Options.
 */
const builderOptions = {
    targetEnvironment: 'node',
    codeBundlingOptions: {
        rootDir: './',
        outDir: './dist',
        entries: [
            'server.js',
            'worker.js'
        ],
        staticDirs: [
            'public'
        ],
        buildMode: 'production',
        packageJson: {
            type: 'module',
            hideDependencies: true,
            hideDevDependencies: true
        }
    },
    codeObfuscationOptions: {
        target: 'node',
        seed: 'abc'
    }
}
builder.setBuilderOptions(builderOptions)

/**
 * Run action after node protector is started.
 */
onStart(() => {
    console.log('Runtime protector is starting.')
})

/**
 * Modification Protection.
 *
 * Set enable to true to enable modification protection.
 * In development mode, the onModified lifecycle is not called.
 */
setModificationProtectionOptions({
    enabled: true
})
onModified(() => {
    console.log('Source code is changed.')
    process.exit()
})

/**
 * Event loop call interval.
 *
 * Set enable to true to enable event loop.
 */
setEventLoopOptions({
    enabled: true,
    eventLoopInterval: 5000 // in miliseconds.
})
onIntervalCall(() => {
    console.log('Interval call.')
})
