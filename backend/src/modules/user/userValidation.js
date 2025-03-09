import Joi from 'joi';

export const gnder_option = ['male' ,'female'];
export const role_option=['User', 'admin', 'Guest']
export const provider_option =['google', 'system']


//* --->> Signup validation
export const signupValidation = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(15).required(),
        lastName: Joi.string().min(3).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        DOB: Joi.date().iso().required(),
        mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/).required(),
        role: Joi.string().valid(...role_option).required(),
        profilePic: Joi.string().optional(),
        coverPic: Joi.string().optional(),
        googleId: Joi.string().optional(),
        provider: Joi.string().valid(...provider_option).default('system'),
        gender: Joi.string().valid(...gnder_option)  
        
    })
};

//* --->> Signin validation
export const signinValidation = Joi.object({
    email: Joi.string().email().required(),
   
    password: Joi.string().required() 
});

//* --->> Update account validation
export const updateAccountValidation = Joi.object({
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().min(11).max(15).pattern(/^01[0-2,5][0-9]{8}$/,'numbers').required(),
    DOB: Joi.date().iso().required(),
    lastName: Joi.string().min(3).max(15).required(),
    firstName: Joi.string().min(3).max(15).required(),
}).required();

//* --->> Update password validation
export const updatePasswordValidation = Joi.object({
    currentPassword: Joi.string()
    .required()
    .min(8),
    
    newPassword: Joi.string()
    .required()
    .min(8)
   
});

//* --->> email  validation
export const requestPasswordResetValidation = Joi.object({
    email: Joi.string().email().required()
});

// * ----> New Password & OTP validation
export const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().integer().min(100000).max(999999).required(),
    newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$')),
    newPassword: Joi.string()
});