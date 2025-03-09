import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";


export const user_DataType = new GraphQLObjectType({
    name:'userResponseTypes',
    fields:{
        _id : { type :GraphQLString},
        firstName: { type :GraphQLString},
        lastName:{ type :GraphQLString}, 
        email:{ type :GraphQLString},  
        provider:{ type :GraphQLString}, 
        gender: { type :GraphQLString} , 
        DOB: {type: GraphQLString}, 
        mobileNumber: { type :GraphQLString}, 
        role:{ type :GraphQLString},


    }
})

 export const alluser_info = new GraphQLList(user_DataType)

 export const company_DataType = new GraphQLObjectType({
    name:'companyResponseTypes',
    fields:{
        companyName : { type :GraphQLString},
        description: { type :GraphQLString},
        industry:{ type :GraphQLString}, 
        address:{ type :GraphQLString},  
        numberOfEmployees:{ type :GraphQLString}, 
        companyEmail: { type :GraphQLString} , 
        approvedByAdmin: {type: GraphQLBoolean}, 
       


    }
})

export const allcompany_info = new GraphQLList(company_DataType)
