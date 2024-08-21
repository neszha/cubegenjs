import path from 'path'
import { CubegenBundler } from '@cubegenjs/bundler'

const buildWithBundler = async () => {
    const bundler = new CubegenBundler({
        rootDir: path.resolve(process.cwd()),
        outDir: path.resolve(process.cwd(), 'dist'),
        entries: [
            'src/cli.js',
            'src/file-system.js',
            'src/main.js',
        ],
        staticDirs: [
            'public',
            'storage'
        ],
        packageJson: {
            type: 'module',
            hideDependencies: false,
            hideDevDependencies: true
        }
    })
    await bundler.build()
    console.log('Success and save result in ./dist')
}

buildWithBundler()