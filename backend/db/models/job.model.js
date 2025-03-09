
import { Schema, model, Types } from "mongoose";
import { jobLocation_option, level_option, workingTime_option } from "../../src/modules/job/jobValidation.js";


// ^Variables Globale 

const jobSchema = new Schema({
    jobTitle: { type: String, required: true },
    jobLocation: { type: String, enum: [...jobLocation_option], required: true },
    workingTime: { type: String, enum: [...workingTime_option], required: true },
    seniorityLevel: { type: String, enum: [...level_option], required: true },
    jobDescription: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    softSkills: { type: [String], required: true },
    addedBy: { type: Types.ObjectId, ref: 'User', required: true },//HR ID
    updatedBy: {type: Types.ObjectId , ref :'User' },//HR id 
    closed: {type: Boolean ,default:false},
    companyid: { type: Types.ObjectId, ref: 'Company' ,required:true},

   

}, { timestamps: true });

const Job = model('Job', jobSchema);

export default Job;
