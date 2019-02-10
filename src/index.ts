import 'reflect-metadata'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import UserResolver from './resolvers/UserResolver'
import { buildSchema } from 'type-graphql'
import mongoose from 'mongoose'
import { UserSchema } from './schemas/user'
import { ObjectIdScalar } from './scalars/ObjectId'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'
import WorkspaceResolver from './resolvers/WorkspaceResolver';
import { WorkspaceSchema } from './schemas/workspace';
import { ApolloContext } from './context/ApolloContext';
import { ApolloAuthChecker } from './validator/AuthChecker';
dotenv.config()
async function boot() {
  const app = express()
  const port = 3000
  mongoose.model('User', UserSchema)
  mongoose.model('Workspace', WorkspaceSchema)
  const db = await mongoose.connect(process.env.MONGOURL,
    {
      autoReconnect: true,
      useNewUrlParser: true,
    })
  const resolvers = await buildSchema({
    resolvers: [UserResolver, WorkspaceResolver],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    authChecker: ApolloAuthChecker
  })
  const apolloServer = new ApolloServer({
    context: ApolloContext,
    schema: resolvers,
    playground: false,
    tracing: true,
  })
  apolloServer.applyMiddleware({ app })
  try {
    await app.listen(port)
    return apolloServer
  } catch (e) {
    throw e;
  }
}
boot().then((server) => {
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
}).catch((error) => {
  console.log(`error : ${error}`)

})