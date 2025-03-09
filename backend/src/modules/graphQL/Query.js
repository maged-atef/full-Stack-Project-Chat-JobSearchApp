import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType ,GraphQLString} from "graphql"
import {company_DataType, user_DataType} from './dataTypes.js'
import { CompanyApproval, CompanyBanned, findcompany_GraphQL, finduser_GraphQL, userBanned } from "./services.js"


export const useQuery={
    users: {
        type: new GraphQLObjectType({
            name: "dataAllUsers" , 
            fields: {
               success: {type: GraphQLBoolean},
               statusCode : {type : GraphQLInt}, 
               Data : {type: new GraphQLList(user_DataType)}
            }
        }),
        resolve: async() => {
            const result = await finduser_GraphQL()
            return result
        }
    },
    company:{
        type: new GraphQLObjectType({
            name:"comanyData", 
            fields:{
                success: {type:GraphQLBoolean},
                statusCode:{type:GraphQLInt},
                Data:{type: new GraphQLList(company_DataType)}
            }
        }), 
        resolve: async ()=>{
            const result = await findcompany_GraphQL() 
            return result
        }
    },
    
}

export const usemutations = {
    BannedCompany:{
        type: new GraphQLObjectType({
            name: "company" , 
            fields: {
               success: {type: GraphQLBoolean},
               statusCode : {type : GraphQLInt}, 
               Data : {type: GraphQLString}
            }
        }), 
        args: {
            approve: {type: GraphQLBoolean},
            id: {type: GraphQLString}
        },
        resolve:async(_ ,args)=>{
            const result = await CompanyBanned(_,args.approve, args.id) ; 
            return result 
        }
    },
    ApproveCompany:{
        type: new GraphQLObjectType({
            name: "Approvecompany" , 
            fields: {
               success: {type: GraphQLBoolean},
               statusCode : {type : GraphQLInt}, 
               Data : {type: GraphQLString}
            }
        }), 
        args: {
            approve: {type: GraphQLBoolean},
            id: {type: GraphQLString}
        },
        resolve:async(_ ,args)=>{
            const result = await CompanyApproval(_,args.approve, args.id) ; 
            return result 
        }
    },
    BannedUser:{
        type: new GraphQLObjectType({
            name: "user" , 
            fields: {
               success: {type: GraphQLBoolean},
               statusCode : {type : GraphQLInt}, 
               Data : {type: GraphQLString}
            }
        }), 
        args: {
            approve: {type: GraphQLBoolean},
            id: {type: GraphQLString}
        },
        resolve:async(_ ,args)=>{
            const result = await userBanned(_,args.approve, args.id) ; 
            return result 
        }
    }
}