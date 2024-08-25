/**
 * Store global state fot Node Protector.
 */

export default {
    /**
     * To trigger runtime protector runnint if is true.
     */
    protectorIsReady: false as boolean,

    /**
     * Value is 'distributed' in distributed mode changed after build process.
     */
    inDevelopmentMode: '%IN_DEVELOPMENT_MODE%' as string | 'distributed',

    /**
     * Private key value changed after build process.
     */
    privateKey01: '%PRIVATE_KEY_01%' as string,

    /**
     * Store call interval timeout.
     */
    callIntervalTimeout: null as NodeJS.Timeout | null
}
