import "./loadEnvironment.mjs";
import connectDb from "./config/connectDatabase.js";
connectDb();

import express, { json } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import allTypeDefs from './schemas/index.schema.js';
import allResolvers from './resolvers/index.resolver.js';
import context from './context/context.js';

import userRouter from "./routes/user.mjs";
import BookRouter from "./routes/Book.mjs";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs: allTypeDefs,
  resolvers: allResolvers,
  includeStacktraceInErrorResponses: false,
  introspection: true,
});

server.start()
.then(() => {
  app.use("/", userRouter);
  app.use("/", BookRouter);

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: context,
    }),
  );

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});