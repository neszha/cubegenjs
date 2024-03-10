import express from 'express'
import router from './router.js'

/**
 * Create express app.
 */
const app = express()
app.use(router)

/**
 * Star express web server.
 */
const port = 8000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
