import { Schema, model, Types } from "mongoose";
import Job from "./job.model.js";

export const hrsStaff = ['hrManager', 'hrDirector', 'hrEmployee']

const companySchema = new Schema({
    companyName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: {
        type: String,
        enum: ['11-20'],
        required: true
    },
    companyEmail: { type: String, required: true, unique: true },
    createdBy: {type : Types.ObjectId ,ref: "User"},
    logo: {type : {
        secure_url: {type :String },
        public_id:{type:String}
    }},
    coverPic: {type : {
        secure_url: {type :String },
        public_id:{type:String}
    }},
    hrs: {type :[String] ,enum: [...hrsStaff] },
    bannedAt:{type :Date , default :null},
    legalAttachment: {
        type : {
            secure_url: {type :String , defualt : "pdf or img"},
            public_id:{type:String, defualt :"id"}
        }
    },
    approvedByAdmin: { type: Boolean, default:false }
   
}, { timestamps: true });

companySchema.post("deleteOne", { query: false, document: true }, async (doc, next) => {
    const parentRecord = doc._id;
    console.log({ idParent: parentRecord })
    const RelatedRecord = await Job.find({companyid: parentRecord.toString()})
    
    if(RelatedRecord.length >0){
        for (const record of RelatedRecord) {
            console.log(record._id)
            await record.deleteOne()
        }
    }

    return next()
})
const Company = model('Company', companySchema);

export default Company;
