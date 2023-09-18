import express from 'express';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './adapters/graphql/schema';
import { resolvers } from './adapters/graphql/resolvers';
import { authenticationMiddleware } from './adapters/middlewares/authentication';
import { mongodbConnection } from './infrastructure/mongodbConnection';

interface GraphQLContext {
    user?: any;
}

const startServer = async () => {
    // Connect to MongoDB
    await mongodbConnection.connect();

    // Create an Express application
    const app = express();

    // Use authentication middleware for Express
    //app.use(authenticationMiddleware);

    const httpServer = http.createServer(app);

    const server = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ user: req.user }),
        }),
    );

    const PORT = process.env.PORT || 4000;
    await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));

    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

startServer().catch(error => {
    console.error('Error starting server:', error);
    process.exit(1);
});
