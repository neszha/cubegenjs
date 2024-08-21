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
