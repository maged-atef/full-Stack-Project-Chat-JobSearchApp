

import { Schema, Types, model } from "mongoose";
import { gnder_option, provider_option, role_option } from "../../src/modules/user/userValidation.js";


//^ variables global 



const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, required: true, enum: [...provider_option], default: "system" },
    gender: { type: String, enum: [...gnder_option] },
    DOB: { type: Date, required: true },
    mobileNumber: { type: String, required: true },
    role: { type: String, enum: [...role_option], required: true },
    confirmed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    bannedAt: { type: Date, default: null },
    updatedby: { type: Types.ObjectId, ref: 'User' },
    changeCredentialTime: { type: Date, default: null },
    profilePicture: {type: {
            secure_url: { type: String ,default: null},
            public_id: { type: String ,default:null}
        }},
    coverPic: {
        type: {
            secure_url: { type: String , default: null},
            public_id: { type: String ,default:null}
        }
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    googleId: { type: String, optional: true },
    profilePic: { type: String }

}, { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}});

userSchema.virtual('username').get(function () {
    return `${this.firstName} ${this.lastName}`;
})

userSchema.post("deleteOne",{query: false , document: true}, async(doc, next)=>{
  
  const ParentRecord = doc._id; 
  const RelatedRecord = await this.constructor.find({parentRecord})
  if(RelatedRecord.length){
      for (const record of RelatedRecord) {
          await record.deleteOne()
      }
  }

    return next()
})

const User = model('User', userSchema);

export default User;
