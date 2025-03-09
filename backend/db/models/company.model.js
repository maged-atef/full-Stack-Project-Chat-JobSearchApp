import { Schema, model, Types } from "mongoose";

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
    approvedByAdmin: { type: Boolean, default:false },
    deletedAt: {type: Date, default: null} // Reference to User model
}, { timestamps: true });

const Company = model('Company', companySchema);

export default Company;
