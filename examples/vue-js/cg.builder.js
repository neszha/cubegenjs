/**
 * Cubegen builder configuration.
 */

export default {
    /**
     * Application key for generate private keys inner your code.
     *
     * You can use a custom random characters.
     */
    appKey: '146be80028e4c15e9c0b8f90c216e3ba79f68f6833f0caed6c1f75be7b2b124d',

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
     * See documentation in https://github.com/neszha/cubegenjs/blob/develop/README.md#codeobfuscationoptions
     */
    codeObfuscationOptions: {
        // Target Environment
        target: 'browser',

        // Random Generator
        seed: '146be80028e4c15e',

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
        renameProperties: false, // This option may break your code
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
