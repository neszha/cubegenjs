/**
 * Store global state fot Node Protector.
 */

export default {
    /**
     * To trigger runtime protector runnint if is true.
     */
    protectorIsReady: false as boolean,

    /**
     * Store site host.
     */
    siteHost: '' as string,

    /**
     * Value is 'distributed' in distributed mode changed after build process.
     */
    inDevelopmentMode: '%IN_DEVELOPMENT_MODE%' as string | 'distributed',

    /**
     * Store call interval timeout.
     */
    callIntervalTimeout: null as NodeJS.Timeout | null
}
