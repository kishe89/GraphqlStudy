"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
async function boot() {
    const app = express_1.default();
    const port = 3000;
    // Construct a schema, using GraphQL schema language
    const typeDefs = apollo_server_express_1.gql `
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
                    }, {
                        name: "Alice",
                        age: 18
                    }];
            }
        }
    };
    const apolloServer = new apollo_server_express_1.ApolloServer({
        typeDefs,
        resolvers,
        playground: true,
        tracing: true
    });
    apolloServer.applyMiddleware({ app });
    try {
        await app.listen(port);
    }
    catch (e) {
        console.log(e);
    }
    console.log(`🚀 Server ready at http://localhost:3000${apolloServer.graphqlPath}`);
}
boot();
//# sourceMappingURL=index.js.map