import cors from 'cors';
import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import apiRouters from './apis.js'
import '../cg.protector.js'

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
    console.log(`Fastify app listening on port http://localhost:${port}`)
})
  