import express from "express";
import {ApolloServer,gql} from "apollo-server-express";


async function boot(){
  const app = express();
  const port = 3000;

  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
  type Query {
    hello: String
    people: [Person]
  }
  type Person{
    name: String
    age: Int
  }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () => 'hello world',
      people: () => {
        return [{
          name: "Davidkim",
          age: 18
        },{
          name: "Alice",
          age: 18
        }]
      }
    }
  };
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground:true,
    tracing: true
  })
  apolloServer.applyMiddleware({app});
  try{
    await app.listen(port)
  }catch(e){
    console.log(e);
  }

  console.log(`🚀 Server ready at http://localhost:3000${apolloServer.graphqlPath}`)
}

boot()