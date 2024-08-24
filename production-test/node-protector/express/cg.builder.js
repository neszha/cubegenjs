export default {
    appKey: 'app_key_1234',

    target: 'node',

    codeBundlingOptions: {
        rootDir: './',
        outDir: './dist',
        entries: [
            'src/main.js',
        ],
        staticDirs: [
            'public',
            'src/static-data'
        ],
        buildMode: 'production',
    },

    codeObfuscationOptions: {
        target: 'node',
        seed: 'abc'
    }
}
