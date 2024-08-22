import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { Listr } from 'listr2'
import { type NodeProtectorBuilderOptions } from '@cubegenjs/node-protector/src/interfaces/NodeProtector'
import { type CubegenBuilderOptions } from '../interfaces/Builder'
import { type CmdBuildOptions } from '../interfaces/Command'
import { NodeBuilder } from '../services/NodeBuilder.js'
import { Observable, type Subscriber } from 'rxjs'

export default {
    cwd: process.cwd(),
    rootProject: '',

    /**
     * Build source code to distribution code.
     */
    async build (options: CmdBuildOptions): Promise<void> {
        this.rootProject = path.join(this.cwd, options.root || './')

        // Run tasks.
        let startTime: number
        let cubegenBuilderConfig: CubegenBuilderOptions
        const tasks = new Listr([
            {
                title: 'Starting building project',
                task: async () => {
                    startTime = new Date().getTime()
                }
            },
            {
                title: 'Getting builder options',
                task: async (ctx, task) => {
                    return new Observable((observer: Subscriber<unknown>) => {
                        observer.next('Read config file...')
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        setTimeout(async () => {
                            cubegenBuilderConfig = await this.getCubegenBuilderConfig()
                            const titleWithTarget = 'Target environment => ' + chalk.green(cubegenBuilderConfig.target)
                            observer.next(titleWithTarget)
                            setTimeout(() => {
                                task.title += ': ' + titleWithTarget
                                observer.complete()
                            }, 500)
                        }, 500)
                    })
                }
            },
            {
                title: 'Building your project',
                task: async (ctx, task) => {
                    return new Observable((observer: Subscriber<unknown>) => {
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        setTimeout(async () => {
                            if (cubegenBuilderConfig.target === 'node') {
                                const cubegenBuilderConfigForNode = cubegenBuilderConfig as NodeProtectorBuilderOptions
                                await this.buildProjectWithNodeBuilder(cubegenBuilderConfigForNode, observer)
                            }
                        }, 500)
                    })
                }
            },
            {
                title: '',
                task: async (ctx, task) => {
                    const endTime = new Date().getTime() - startTime
                    const durationInSeconds = endTime / 1000
                    task.title = `Done in ${durationInSeconds.toFixed(1)}s`
                }
            }
        ])

        // Exec tasks.
        await tasks.run()
    },

    /**
     * Get cubgen builder config in project directory.
     */
    async getCubegenBuilderConfig (): Promise<CubegenBuilderOptions> {
        // Check bundler config file exists.
        const configFileName = 'cg.builder.js'
        const builderFilePath = path.join(this.rootProject, configFileName)
        if (!fs.existsSync(builderFilePath)) {
            throw new Error('Error: Can not find file `cg.builder.js` in your project directory')
        }

        // Read builder config file.
        const builderOptionsData = await import(builderFilePath)
        const builderOptions = builderOptionsData.default as CubegenBuilderOptions
        const allowtargets = ['node', 'web']
        if (!allowtargets.includes(builderOptions.target as string)) {
            throw new Error('Error: Invalid target environment. Use `node` or `web`')
        }

        // Done.
        return builderOptions
    },

    /**
     * Start build project with node builer.
     */
    async buildProjectWithNodeBuilder (builderConfig: NodeProtectorBuilderOptions, observer: Subscriber<unknown>): Promise<void> {
        const nodeBuilder = new NodeBuilder({
            rootDir: this.rootProject,
            builderConfig,
            observer
        })
        await nodeBuilder.build()
    }

    /**
     * Start build project with web builer.
     */
}
