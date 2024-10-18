import { type WebProtectorDomainLockingOptions } from './interfaces/WebProtector.js'

describe('Test Functional Web Protector Module', () => {
    it('Success run onStart callback lifecycle', async () => {
        const webProtector = await import('../src/index.js')
        let isCalled = false
        webProtector.onStart(() => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 500)
    })

    it('Success run onDocumentLoaded callback lifecycle', async () => {
        const webProtector = await import('../src/index.js')
        let isCalled = false
        webProtector.onDocumentLoaded(() => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 500)
    })

    it('onDomainNotAllowed called if site host is not in whitlist', async () => {
        const webProtector = await import('../src/index.js')
        let isCalled = false
        webProtector.customState.inDevelopmentMode = 'distributed'
        webProtector.customState.siteHost = 'example.com'
        const inputOptions: WebProtectorDomainLockingOptions = {
            enabled: true,
            whitlist: [
                // 'example.com',
                'example1.com',
                'example2.com',
                '/example3.com/i'
            ]
        }
        webProtector.onDomainNotAllowed(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(true)
        }, 1000)
    })

    it('onDomainNotAllowed not called if not enabled', async () => {
        const webProtector = await import('../src/index.js')
        const inputOptions: WebProtectorDomainLockingOptions = {
            enabled: false,
            whitlist: []
        }
        let isCalled = false
        webProtector.onDomainNotAllowed(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(false)
        }, 500)
    })

    it('onDomainNotAllowed not called in development project', async () => {
        const webProtector = await import('../src/index.js')
        webProtector.customState.inDevelopmentMode = 'development'
        const inputOptions: WebProtectorDomainLockingOptions = {
            enabled: true,
            whitlist: []
        }
        let isCalled = false
        webProtector.onDomainNotAllowed(inputOptions, () => {
            isCalled = true
        })
        setTimeout(() => {
            expect(isCalled).toBe(false)
        }, 500)
    })
})
