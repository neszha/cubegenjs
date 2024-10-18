/**
 * Cubegen builder configuration.
 */

export default {
    /**
     * Application key for generate private keys inner your code.
     *
     * You can use a custom random characters.
     */
    appKey: '5c1db867c355c847202d6c2a7c3642209b2b51bbb681114314068de3fe681570',

    /**
     * Target where your application will be run in production.
     *
     * Available options: 'node' & 'browser'
     */
    target: 'browser',

    /**
     * Command to build your web project.
     *
     * The build command example: `npm run build` or `yarn build`
     */
    buildCommand: 'npm run build',

    /**
     * Obfuscation option to obfuscate your protector code.
     *
     * See documentation in https://github.com/neszha/cubegenjs
     */
    codeObfuscationOptions: {
        // Target Environment
        target: 'browser',

        // Random Generator
        seed: '5c1db867c355c847',

        // Control Flow Flattening
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,

        // Converting
        numbersToExpressions: true,
        transformObjectKeys: true,
        splitStrings: true,
        splitStringsChunkLength: 10,

        // Renaming
        renameGlobals: true, // This option may break your code
        renameProperties: true, // This option may break your code
        renamePropertiesMode: 'safe',
        identifierNamesGenerator: 'mangled-shuffled',

        // String Array
        stringArray: true,
        stringArrayThreshold: 1,
        stringArrayCallsTransform: true,
        stringArrayCallsTransformThreshold: 1,
        stringArrayEncoding: [
            'base64'
        ],
        stringArrayIndexesType: [
            'hexadecimal-number',
            'hexadecimal-numeric-string'
        ],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 2,
        stringArrayWrappersChainedCalls: true,
        stringArrayWrappersParametersMaxCount: 5,
        stringArrayWrappersType: 'function',

        // Minifier
        compact: true,
        simplify: true
    }
}
