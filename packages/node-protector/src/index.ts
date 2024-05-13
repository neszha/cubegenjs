/**
 * Node Protector Interfaces.
 *
 * Handle user configuration to protect NodeJS source code.
 */

import { type CubegenNodeBuilderOptions } from './types/NodeProtector'

/**
 * Builder Options.
 */
let builderOptions: CubegenNodeBuilderOptions
export const setBuilderOptions = (options: CubegenNodeBuilderOptions): void => {
    builderOptions = {
        ...builderOptions,
        ...options
    }
}

/**
 * Node Protector: Modification protection.
 */
