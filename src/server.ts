import Fastify from 'fastify';
import mercurius from 'mercurius';
import depthLimit from 'graphql-depth-limit';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { createLoaders } from './loaders';

const app = Fastify({ logger: true });

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


