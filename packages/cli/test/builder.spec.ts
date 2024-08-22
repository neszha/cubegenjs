import builder from '../src/commands/builder'

describe('Test Build Node Project', () => {
    it('Success build node project', async () => {
        await builder.build({
            root: './packages/cli/test/examples/node-sample'
        })
        expect(true).toBe(true)
    })
})
