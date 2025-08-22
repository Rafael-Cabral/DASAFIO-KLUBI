"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mercurius_1 = __importDefault(require("mercurius"));
const graphql_depth_limit_1 = __importDefault(require("graphql-depth-limit"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const loaders_1 = require("./loaders");
const app = (0, fastify_1.default)({ logger: true });
app.register(mercurius_1.default, {
    schema: schema_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    graphiql: process.env.NODE_ENV !== 'production',
    context: (req, reply) => ({
        loaders: (0, loaders_1.createLoaders)(),
        req, reply
    }),
    validationRules: [(0, graphql_depth_limit_1.default)(6)],
    queryDepth: 6,
});
const port = Number(process.env.PORT || 4000);
app.listen({ port, host: '0.0.0.0' });
//# sourceMappingURL=server.js.map