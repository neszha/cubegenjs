#!/usr/bin/env node

import { Command } from 'commander'
import builder from '../cli/builder.js'

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
    .action(async (str, options): Promise<void> => {
        await builder.build()
    })

/**
 * Render the command program.
 */
program.parse()
