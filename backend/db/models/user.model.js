

import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, required: true, enum: ['google', 'system'], default: "system" },
    gender: { type: String, enum: ['male', 'female']},
    DOB: { type: Date, required: true },
    mobileNumber: { type: String, required:true },
    role: { type: String, enum: ['User', 'admin'], required: true },
    confirmed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    bannedAt: { type: Date, default: null },
    updatedby: { type: Types.ObjectId, ref: 'User' },
    changeCredentialTime: { type: Date, default: null },
    profilePic: {
        type: {
            seccure_url: { type: String ,default:null},
            public_id: { type: String ,default:null}
        }
    },
    coverPic: {
        type: {
            seccure_url: { type: String ,default:null},
            public_id: { type: String , default:null}
        }
    },
    otp: { type: String },
    otpExpiry: { type: Date },
   googleId:{type: String, optional: true},
   profilePic:{type:String}

}, { timestamps: true });

userSchema.virtual('username').get(function () {
    return `${this.firstName} ${this.lastName}`;
})

const User = model('User', userSchema);

export default User;
