import { onModified, setBuilderOptions, setModificationProtectionOptions, onStart } from '@cubegen/node-protector'

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
 * Run action after node protector is started.
 */
onStart(() => {
    console.log('exec: onStart')
})

/**
 * Modification Protection.
 *
 * Set enable to true to enable modification protection.
 */
setModificationProtectionOptions({
    enabled: true
})
onModified(() => {
    console.log('exec: onModified')
    process.exit()
})
