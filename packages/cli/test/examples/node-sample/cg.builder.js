export default {
    appKey: 'app_key_1234',

    target: 'node',

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
        buildMode: 'production'
    },

    codeObfuscationOptions: {
        target: 'node',
        seed: 'abc'
    }
}
