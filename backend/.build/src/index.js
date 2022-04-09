"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acsport1 = exports.googleCloud = void 0;
//#TODO: Why does ES6 syntax provide perfomrance benefits?
require("dotenv/config");
var express_1 = __importDefault(require("express"));
//import { ApolloServer, gql }  from 'apollo-server-express';
var apollo_server_lambda_1 = require("apollo-server-lambda");
var mongoose_1 = __importDefault(require("mongoose"));
var resolvers_1 = require("./resolvers/resolvers");
var graphql_upload_1 = require("graphql-upload");
var typeDefs_1 = require("./typeDefs/typeDefs");
var storage_1 = require("@google-cloud/storage");
var http_1 = require("http");
var schema_1 = require("@graphql-tools/schema");
exports.googleCloud = new storage_1.Storage({
    keyFilename: "../backend/src/activitybook-a598b-782d9db5058e.json",
    projectId: "activitybook-a598b",
});
exports.acsport1 = exports.googleCloud.bucket('acsport1');
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var uri, app, httpServer, schema, server;
    return __generator(this, function (_a) {
        uri = process.env.ATLAS_URI;
        console.log("this is the uri:", uri);
        app = (0, express_1.default)();
        app.use((0, graphql_upload_1.graphqlUploadExpress)());
        httpServer = (0, http_1.createServer)(app);
        schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.resolvers });
        server = new apollo_server_lambda_1.ApolloServer({
            typeDefs: typeDefs_1.typeDefs,
            resolvers: resolvers_1.resolvers,
            context: function (_a) {
                var event = _a.event, context = _a.context;
                return ({
                    headers: event.headers,
                    functionName: context.functionName,
                    event: event,
                    context: context
                });
            }
            //context: async ({ req, res }) => ({ req, res}),
            //context: async ({ req, res }) => ({ req, res, pubsub }),
            //schema,
            //plugins: [
            //{
            //async serverWillStart() {
            //return {
            //async drainServer() {
            //subscriptionServer.close();
            //},
            //};
            //},
            //},
            //],
        });
        //await server.start()
        server.createHandler();
        //server.applyMiddleware({ app });
        //console.log("path", server.graphqlPath)
        //const subscriptionServer = SubscriptionServer.create({
        //// This is the `schema` we just created.
        //schema,
        //// These are imported from `graphql`.
        //execute,
        //subscribe,
        //}, {
        //// This is the `httpServer` we created in a previous step.
        //server: httpServer,
        //// This `server` is the instance returned from `new ApolloServer`.
        //path: server.graphqlPath,
        ////path: '/subscriptions',
        //});
        //////////// cloud stuff //////////////
        exports.googleCloud.getBuckets().then(function (x) {
            console.log(x);
        }).catch(function (error) { console.log(error); });
        ///////////////////////////////////////
        ////////// mongodb stuff //////////////////
        ////////////////////////////////////////////
        ////////// mongodb stuff //////////////////
        //const uri2 = "mongodb+srv://damini:turing2030@cluster0.xmukg.mongodb.net/<dbname>?retryWrites=true&w=majority"
        mongoose_1.default.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            //})
            //.then(
            //console.log("connected")
            //)
            .catch(function (error) { console.log(error); });
        ////////////////////////////////////////////
        httpServer.listen({ port: 4000 }, function () {
            return console.log("\uD83D\uDE80 Server ready at http://localhost:4000".concat(server.graphqlPath));
        });
        exports.graphqlHandler = server.createHandler();
        return [2 /*return*/];
    });
}); };
startServer();
