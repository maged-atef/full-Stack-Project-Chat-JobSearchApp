import User from "../../../db/models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendMail } from "../../service/email.js";
import CryptoJS from "crypto-js";
import application from '../../../db/models/application.model.js'




//* ----->  Async Handler
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.error(err); //* ----->  Log error details to the console
            res.status(500).json({ msg: "catch error", err: err.message || err });
        });
    };
};


//* ----->  Signup
export const signup = asyncHandler(async (req, res, next) => {

    const { firstName, lastName, email, password, DOB, mobileNumber, role, provider } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new Error("Email already exists"));
    }
    const otp = Math.ceil(Math.random() * 1000000) + 1;
    const otpExpiry = new Date(Date.now() + 10 * 60000);
    await sendMail(
        email,
        "OTP Verification",
        `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 5px; overflow: hidden; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <div style="background-color: #2196F3; color: #fff; padding: 10px; text-align: center;">
                    <h2 style="margin: 0;">OTP Verification</h2>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px;">Your OTP is: <strong>${otp}</strong></p>
                </div>
            </div>
        </div>`
    );
    const hash = bcrypt.hashSync(password, 10);
    const encryptPhone = CryptoJS.AES.encrypt(mobileNumber, process.env.SECRETKEY)

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hash,
        DOB,
        mobileNumber: encryptPhone,
        role,
        otp,
        otpExpiry,
        
    });

    res.status(201).json({ message: 'User created successfully', otp: newUser.otp });
});


//* ----->  Confirm Email
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { otp } = req.body;
    const user = await User.findOne({ otp, otpExpiry: { $gt: Date.now() } });
    if (!user) {
        return next(new Error("Invalid OTP or OTP Expiry"));
    }
    user.confirmed = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.json({ msg: "Email confirmed successfully" });
});


//* ----->  Sign In
export const signin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email: email });

    if (!user) {
        return next(new Error("Invalid email or password"));
    }
    if (!bcrypt.compareSync(password, user.password)) {
        return next(new Error("you entered a wrong password... "))
    }

    if (user.bannedAt != null) return res.status(400).json({ success: false, msg: `the account is prohibited to login banned at : ${user.bannedAt}` })
    if (!user.confirmed === true) return res.status(400).json({ success: false, msg: 'user not activated' })


    const Accesstoken = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '1h' });
    const refreshtoken = jwt.sign({ id: user._id }, process.env.SECRETKEY, { expiresIn: '7d' });
    const userData_response = await User.findOne({ email }, { _id: 0, password: 0 })
    res.status(200).json({
        Acesstoken: `Bearer ${Accesstoken}`,
        RefreshToken: `Bearer ${refreshtoken}`,
        success: true, 
        msg: 'done',
        username: user.firstName
    });
});

//*------> signup Google use link in browser----------->  http://localhost:3000/user/google
export const signupGoogle = async (req, res, next) => {

}

// *-----> login Google 
export const googlein = async (req, res, next) => {
    const { token } = req.params;
    console.log(`token: `, token)
    const { id } = jwt.verify(token, process.env.SECRETKEY);
    console.log(`id : `, id)
    const find = await User.findOne({ _id: id }, { password: 0 });
    if (!find) return res.status(400).json({ success: false, msg: "invalid token" })
    res.status(200).json({ success: true, msg: "welcom", data: find })
}

//* ----->  Update Account
export const update = asyncHandler(async (req, res, next) => {

    const { email, mobileNumber, DOB, lastName, firstName } = req.body;
    const user = await User.findOne({ email }).select('firstName ,lastName ,DOB, mobileNumber');
    if (!user) {
        return next(new Error("User not found"));
    }

    try {

        const mobileRegex = /^01[0125][0-9]{8,11}$/
        const mobileCheck = mobileRegex.test(mobileNumber)
        if (!mobileCheck) return res.status(400).json({ Success: false, msg: 'invalid phone formate' })

        const DateRegex =/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
        const DateCheck = DateRegex.test(DOB)
        if (!DateCheck) return res.status(400).json({ Success: false, msg: 'invalid DOB formate' })
        user.mobileNumber = mobileNumber
        user.DOB = DOB;
        user.lastName = lastName;
        user.firstName = firstName;
        await user.save();
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

    res.status(200).json({ msg: 'User account updated successfully', user });
});


//* ----->  Delete Account
export const deleteAccount = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new Error("User not found"));
    }
    //* -----> 
    if (user.status !== 'online') {
        return next(new Error({ msg: 'User must be online to delete their account' }))
    }
    await User.findByIdAndDelete(userId);

    res.status(200).json({ msg: 'User account deleted successfully' });
});

//* ----->  Get Account
export const getAcc = asyncHandler(async (req, res, next) => {
    let { id } = req.body

    const user = await User.findById(id, { password: 0 });

    if (!user.deletedAt == null) {
        return res.status(400).json({ success: false, msg: 'this account has been deleted' })
    }
    if (!user) {
        return next(new Error("User not found"));
    }

    user.mobileNumber = CryptoJS.AES.decrypt(user.mobileNumber, process.env.SECRETKEY).toString(CryptoJS.enc.Utf8)
    res.status(200).json(user);
});


//* ----->  Get Profile by ID
export const GetProfile = asyncHandler(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId ,{password: 0 });
    if (!user) {
        return next(new Error("User not found"));
    }
    res.status(200).json({ user });
});


//* ----->  Update Password
export const updatePassword = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
        return next(new Error("User not found"));
    }
    if (!bcrypt.compareSync(currentPassword, user.password)) {
        return next(new Error("Current password is incorrect"));
    }
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedNewPassword;
    const email = user.email;
    await sendMail(
        email,
        "Password Update Confirmation",
        `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333333; margin-bottom: 10px;">Password Updated Successfully</h2>
                <p style="color: #555555; font-size: 16px;">Your password has been updated successfully. If you did not request this change, please contact support immediately.</p>
            </div>
        </div>`
    );
    await user.save();
    res.status(200).json({ msg: "Password updated successfully" });
});

//* ----->  request password to reset
export const requestPasswordReset = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("User not found"));
    }
    const otp = Math.ceil(Math.random() * 1000000) + 1;
    const otpExpiry = new Date(Date.now() + 15 * 60000);
    await sendMail(
        email,
        "Password Reset OTP",
        `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333333; margin-bottom: 10px;">Password Reset Request</h2>
            <p style="color: #555555; font-size: 16px;">We received a request to reset your password. Use the following OTP to complete the process:</p>
            <div style="background-color: #2196F3; color: #ffffff; border-radius: 5px; padding: 15px; margin: 20px 0; font-size: 24px; font-weight: bold;">
                ${otp}
            </div>
            <p style="color: #777777; font-size: 14px;">If you did not request this password reset, please ignore this email.</p>
        </div>
    </div>`
    );
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    res.status(200).json({ msg: "OTP sent to your email" });
});

//* -----> rese password
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return next(new Error("Email, OTP, and new password are required"));
    }
    const user = await User.findOne({ otp, otpExpiry: { $gt: Date.now() } });
    if (!user) {
        return next(new Error("User not found"));
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({ msg: "Password reset successfully" });
});



//* -----> upload profile pic 
export const upload_profile_pic = async (req, res, next) => {
    const file = req.file
    const userId = req.user._id
    const user = await User.findOne(req.user._id)
    if(!req.file) return res.status(400).json({success: false , msg: 'no profile picture is provided'})

    user.profilePic = {
        seccure_url: req.file.path,
        public_id: `profilepic${user._id}`
    }
    await user.save()
    res.status(200).json({ success: true, user: userId, file: file })

}

//* -----> upload cover pic 
export const Upload_Cover_pic = async (req, res, next) => {
    const file = req.file
    const userId = req.user._id
    const user = await User.findOne(req.user._id)

    if(!req.file) return res.status(400).json({success: false , msg: 'no cover picture is provided'})
    user.coverPic = {
        seccure_url: req.file.path,
        public_id: `coverpic${user._id}`
    }
    await user.save()
    res.status(200).json({ success: true, user: userId, file: file })

}

//* -----> delete cover pic 
export const Delete_CoverPic = async (req, res, next) => {
    const userId = req.user._id
    const user = await User.findOne(req.user._id)
    if (user.coverPic.seccure_url.startsWith("Default")) return res.status(200).json({ success: false, msg: 'no cover picture' })

    user.coverPic = {
        seccure_url: "Default Cover picture",
        public_id: `coverpic${user._id}`
    }
    await user.save()

    res.status(200).json({ success: true, coverPic_DeletedFor_user: userId })

}

//* -----> delete profile pic 
export const Delete_ProfilePic = async (req, res, next) => {
    const userId = req.user._id
    const user = await User.findOne(req.user._id)

    if (user.profilePic.seccure_url.startsWith("Default")) return res.status(200).json({ success: false, msg: 'no profile picture' })
    user.profilePic = {
        seccure_url: "Default profile picture",
        public_id: `profilepic${user._id}`
    }
    await user.save()

    res.status(200).json({ success: true, profilePic_DeletedFor_user: userId })

}

//* -----> delete account [soft] 
export const Delete_UserAccount = async (req, res, next) => {
    const id = req.user._id
    const user = await User.findOne(id)

    if (!user) return res.status(400).json({ success: false, msg: 'no such a user account exists in our dbs ' })
    // const del = await User.findByIdAndDelete(id)
    user.deletedAt = new Date()
    await user.save()

    res.status(200).json({ success: true, msg: "account deleted" })
}

//* ----->get all deleted accounts [soft] 
export const getsoftDeleted = async (req, res, next) => {
    const id = req.user._id
    const user = await User.findOne({ deletedAt: { $ne: null } })



    res.status(200).json({ success: true, soft_deleted: user })
}



//* ----->hr response to  applications
export const hrResponse_toApplication = async (req, res, next) => {
    const id = req.user._id
    const { jobid, userid, status, application_id } = req.body
    const record = await application.findOne({ _id: application_id, user: userid, job: jobid })
    if (!record) return res.status(400).json({ succes: false, msg: 'no application with this id ' })
    record.status = status
    await record.save()
    const find_userData = await User.findOne({ _id: userid })
    sendMail(find_userData.email,
        "Job Interview Response",
        `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 5px; overflow: hidden; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
                <div style="background-color: #2196F3; color: #fff; padding: 10px; text-align: center;">
                    <h2 style="margin: 0;">Humen Resources Response</h2>
                </div>
                <div style="padding: 20px;">
                    <p style="font-size: 16px;"><strong>You are ${record.status}</strong></p>
                </div>
            </div>
        </div>`
    )
    res.status(200).json({ success: true, data: record })
}

// *------->> refresh token 
export const refreshtoken = async (req, res, next) => {
    const { token } = req.headers
    console.log(token)

    if (!token.startsWith("Bearer")) return res.status(400).json({ success: false, msg: 'invalid token' })
    const { id } = jwt.verify(token.split(" ")[1], process.env.SECRETKEY)
    console.log(id)
    const findUser = await User.findOne({ _id: id }, { confirmed: 1, _id: 0 })
    if (!findUser.confirmed) return res.status(400).json({ success: false, msg: 'user not activated' })
    const newtoken = jwt.sign({ id: findUser._id }, process.env.SECRETKEY)
    return res.status(200).json({ success: true, newToken: newtoken })
}



// *------->> banned_user
export const banned_user = async (req, res, next) => {
    const { userid } = req.body


    if (!userid) return res.status(400).json({ success: false, msg: 'invalid user id ' })

    const findUser = await User.findOne({ _id: userid }, { bannedAt: 1, })
    if (findUser.bannedAt != null) return res.status(400).json({ success: false, msg: 'user already banned' })
    let now = new Date();
    findUser.bannedAt = now
    findUser.save()
    return res.status(200).json({ success: true, msg: 'user banned ' })
}