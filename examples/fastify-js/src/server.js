import cors from 'cors';
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import apiRouters from './apis.js'
import '../cg.protector.js'

const startTime = Date.now();

/**
 * Create fastify app.
 */
const port = 3000
const fastify = Fastify({
    logger: true
})
const APP_ROOT = process.cwd()

/**
 * Fastify middlewares.
 */
fastify.register(cors);
fastify.register(fastifyStatic, {
    root: `${APP_ROOT}/public`,
    prefix: '/',
})
fastify.register(apiRouters);

/**
 * Start http server.
 */
fastify.listen({ port }, (err, address) => {
    if (err) throw err
    const endTime = Date.now();
    const startupTime = endTime - startTime;
    console.log(`Fastify app listening on port http://localhost:${port}`)
    console.log(`Startup time: ${startupTime} ms`);

    // Get memory usage.
    setTimeout(() => {
        const memUsage = process.memoryUsage();
        console.log(`Memory usage: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    }, 2000);
})
  