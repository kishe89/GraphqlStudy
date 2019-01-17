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
dotenv.config()
async function boot() {
  const app = express()
  const port = 3000
  mongoose.model('User', UserSchema)
  const db = await mongoose.connect(process.env.MONGOURL,
    {
      autoReconnect: true,
      useNewUrlParser: true,
    })
  const resolvers = await buildSchema({
    resolvers: [UserResolver],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  })
  const apolloServer = new ApolloServer({
    schema: resolvers,
    playground: true,
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