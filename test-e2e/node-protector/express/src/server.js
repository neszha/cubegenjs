import cors from 'cors';
import morgan from 'morgan'
import express from 'express'
import apiRouters from './apis.js'
import '../cg.protector.js'

/**
 * Create express app.
 */
const APP_ROOT = process.cwd()
const app = express()
const port = 3000

/**
 * Express middlewares.
 */
app.use(cors());
app.use(morgan('tiny'))
app.use('/', express.static(`${APP_ROOT}/public`));
app.use('/api', apiRouters)

/**
 * Express Rest API Routes.
 */
app.get('/api', (req, res) => {
    res.js
})

/**
 * Start http server.
 */
app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
})