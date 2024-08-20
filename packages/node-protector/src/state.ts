/**
 * Store global state fot Node Protector.
 */

export default {
    /**
     * To trigger runtime protector runnint if is true.
     */
    protectorIsReady: false as boolean,

    /**
     * Value is 'distributed' in distributed mode.
     */
    inDevelopmentMode: '%IN_DEVELOPMENT_MODE%' as string | 'distributed'
}
