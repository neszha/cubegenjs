import { onModified, setBuilderOptions, setModificationProtectionOptions } from '@cubegen/node-protector'

/**
 * Builder Options.
 */
setBuilderOptions({
    codeBundlingOptions: {
        rootDir: './',
        outDir: './dist',
        entries: [
            'server.js'
        ],
        staticDirs: [
            'public'
        ]
    },
    codeObfuscationOptions: {
        target: 'node',
        seed: 0
    }
})

/**
 * Modified Lifecyles.
 *
 * Set enable to true to enable modification protection.
 */
setModificationProtectionOptions({
    enabled: true
})
onModified(() => {
    console.log('exec: onModified')
})

/**
 * Start Lifecyles.
 *
 * Run action when node protector starting.
 */
onStart(() => {
    console.log('exec: onStart')
})
