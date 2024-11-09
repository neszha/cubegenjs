import cors from 'cors';
import morgan from 'morgan'
import express from 'express'
import apiRouters from './apis.js'
import '../cg.protector.js'

const startTime = Date.now();

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
 * Start http server.
 */
app.listen(port, () => {
    const endTime = Date.now();
    const startupTime = endTime - startTime;
    console.log(`Express app listening on port http://localhost:${port}`)
    console.log(`Startup time: ${startupTime} ms`);

    // Get memory usage.
    setTimeout(() => {
        const memUsage = process.memoryUsage();
        console.log(`Memory usage: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    }, 2000);
})