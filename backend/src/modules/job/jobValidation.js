
import joi from 'joi';

const jobLocation_option =['onsite', 'remotely', 'hybrid']
const workingTime_option =['part-time', 'full-time']
const level_option =['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO']
export const addJobValidation = {
    body: joi.object({
        jobTitle: joi.string().min(3).max(30).required(),
        jobLocation: joi.string().valid(...jobLocation_option).required(),
        workingTime: joi.string().valid(...workingTime_option).required(),
        seniorityLevel: joi.string().required(),
        jobDescription: joi.string().min(10).max(100).required(),
        technicalSkills: joi.array().items(joi.string().min(1)).min(1).required(),
        softSkills: joi.array().items(joi.string().min(1)).min(1).required(),
        companyId: joi.string().required()
       
    }),
};
export const updateJobValidation = {
    body: joi.object({
        jobTitle: joi.string().min(3).max(100).optional(),
        jobLocation: joi.string().valid(...jobLocation_option).optional(),
        workingTime: joi.string().valid(...workingTime_option).optional(),
        seniorityLevel: joi.string().valid(...level_option).optional(),
        jobDescription: joi.string().min(10).max(1000).optional(),
        technicalSkills: joi.array().items(joi.string()).optional(),
        softSkills: joi.array().items(joi.string()).optional(),
    }),
    params: joi.object({
        id: joi.string().required(),
    }),
};

export const deleteJobValidation = {
    params: joi.object({
        id: joi.string().required(),
    }),
};
