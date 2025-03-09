import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { usemutations, useQuery } from "./Query.js";


export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "userInfo",
        description: "Get All users info ",
        fields: useQuery
    }),
    mutation: new GraphQLObjectType({
        name:"updatecompanyStatus",
        description:'banned or not ',
        fields: usemutations
    })
})