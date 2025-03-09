import mongoose, { Types } from 'mongoose';


const applicationSchema = new mongoose.Schema({
    job: { type: Types.ObjectId, ref: 'Job', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },
    resume: { type: {
        secure_url: {type : String , default:""},
        public_id: {type : String , default :""}
    }, required: true },
    status: { type: String, enum:['pending', 'accepted', `viewed` , `in consideration`, 'rejected'], default: 'pending' },
    companyid: {type:Types.ObjectId , required:true , ref:'Company'}
},{timestamps:true});

 const application =  mongoose.model('Application', applicationSchema);

export default application


