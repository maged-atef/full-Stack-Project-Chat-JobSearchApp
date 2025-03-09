
import { Schema, model, Types } from "mongoose";

const jobSchema = new Schema({
    jobTitle: { type: String, required: true },
    jobLocation: { type: String, enum: ['onsite', 'remotely', 'hybrid'], required: true },
    workingTime: { type: String, enum: ['part-time', 'full-time'], required: true },
    seniorityLevel: { type: String, enum: ['Fresh','Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'], required: true },
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
