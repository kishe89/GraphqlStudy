"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const UserResolver_1 = __importDefault(require("./resolvers/UserResolver"));
const type_graphql_1 = require("type-graphql");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./schemas/user");
const ObjectId_1 = require("./scalars/ObjectId");
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const WorkspaceResolver_1 = __importDefault(require("./resolvers/WorkspaceResolver"));
const workspace_1 = require("./schemas/workspace");
const ApolloContext_1 = require("./context/ApolloContext");
const AuthChecker_1 = require("./validator/AuthChecker");
dotenv_1.default.config();
async function boot() {
    const app = express_1.default();
    const port = 3000;
    mongoose_1.default.model('User', user_1.UserSchema);
    mongoose_1.default.model('Workspace', workspace_1.WorkspaceSchema);
    const db = await mongoose_1.default.connect(process.env.MONGOURL, {
        autoReconnect: true,
        useNewUrlParser: true,
    });
    const resolvers = await type_graphql_1.buildSchema({
        resolvers: [UserResolver_1.default, WorkspaceResolver_1.default],
        scalarsMap: [{ type: mongodb_1.ObjectId, scalar: ObjectId_1.ObjectIdScalar }],
        authChecker: AuthChecker_1.ApolloAuthChecker
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        context: ApolloContext_1.ApolloContext,
        schema: resolvers,
        playground: false,
        tracing: true,
    });
    apolloServer.applyMiddleware({ app });
    try {
        await app.listen(port);
        return apolloServer;
    }
    catch (e) {
        throw e;
    }
}
boot().then((server) => {
    console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
}).catch((error) => {
    console.log(`error : ${error}`);
});
//# sourceMappingURL=index.js.map