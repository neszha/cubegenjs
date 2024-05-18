#!/usr/bin/env node

import { Command } from 'commander'
import builder from '../cli/builder.js'
import { type CmdBuildOptions } from '../types/Command.js'

/**
 * Initialize.
*/
const program = new Command()
program.name('cubegen')
    .description('Protecting and Optimizing your JavaScript Source Code')
    .version('0.1.0')

/**
 * Builder command.
 */
program.command('build')
    .description('Building your code to distribution code.')
    .option('-r, --root <string>', 'Root project directory', './')
    .action(async (options: CmdBuildOptions): Promise<void> => {
        await builder.build(options)
    })

/**
 * Render the command program.
 */
program.parse()
