import builder from '../src/commands/build'

describe('Test Build Node Project', () => {
    it('Success build node project', async () => {
        await builder.build({
            root: './packages/cli/test/examples/node-sample'
        })
        expect(true).toBe(true)
    }, 15_000)

    it('Success generate obfus protector web project', async () => {
        await builder.build({
            root: './packages/cli/test/examples/web-sample'
        })
        expect(true).toBe(true)
    }, 15_000)
})
