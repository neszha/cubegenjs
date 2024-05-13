import { setBuilderOptions } from '@cubegen/node-protector'

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
