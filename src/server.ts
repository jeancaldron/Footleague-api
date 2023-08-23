import mongoose from "mongoose";
import dotenv from "dotenv";
import gql from "graphql-tag";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { readFileSync } from "fs";
import { resolvers } from "./graphql/resolvers";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const typeDefs = gql(
  readFileSync("src/graphql/schema.graphql", {
    encoding: "utf-8",
  })
);

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

const initializeApolloServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  await new Promise((resolve) =>
    httpServer.listen({ port: SERVER_PORT }, resolve as () => void)
  );
};

const run = async () => {
  await connectToDatabase();
  await initializeApolloServer();
  console.log(`🚀 Server ready at http://localhost:${SERVER_PORT}`);
};
run();
