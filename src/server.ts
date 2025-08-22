import Fastify from 'fastify';
import mercurius from 'mercurius';
import depthLimit from 'graphql-depth-limit';
import rateLimit from '@fastify/rate-limit';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createLoaders } from './loaders';
import { redis } from './cache';

const app = Fastify({ logger: true });

app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis,
    allowList: (req: any) => String(req.url || '').startsWith('/graphiql')
});

app.register(mercurius, {
    schema: typeDefs,
    resolvers,
    graphiql: process.env.NODE_ENV !== 'production',
    context: (req, reply) => ({
        loaders: createLoaders(),
        req, reply
    }),
    validationRules: [depthLimit(6)],
    queryDepth: 6,
});

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: '0.0.0.0' });


