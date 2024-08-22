#!/usr/bin/env node

import { Command } from 'commander'
import { type CmdBuildOptions } from '../src/interfaces/Command.js'
import builder from '../src/commands/builder.js'

/**
 * Initialize.
*/
const program = new Command()
program.name('cubegen')
    .description('Protecting and Optimizing your JavaScript Source Code')
    .version('0.1.0')

/**
 * Build command.
 */
program.command('build')
    .description('Building your project to distribution code.')
    .option('-r, --root <string>', 'Relative root project directory', './')
    .action(async (options: CmdBuildOptions): Promise<void> => {
        await builder.build(options)
    })

/**
 * Render the command program.
 */
program.parse()
