
import { sendMail } from "../../service/email.js";
import Job from "../../../db/models/job.model.js";
import Company from "../../../db/models/company.model.js";
import mongoose from "mongoose";
import User from "../../../db/models/user.model.js";
import exceljs from 'exceljs'
import application from "../../../db/models/application.model.js";
import { addJobValidation } from "./jobValidation.js";

// *----------> Async Handler
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.error(err); // Log error details to the console
            res.status(500).json({ msg: "catch error", err: err.message || err });
        });
    };
};

// * --------<< add job >>----------------
export const addJob = asyncHandler(async (req, res, next) => {

    const {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        companyId
    } = req.body;

    const admin = req.user._id;


    try {

        const check_company = await Company.findOne({ _id: companyId })

        if (!check_company) {
            return next(new Error('Company does not exist'))
        }


        const new_job = await Job.create({
            jobTitle: jobTitle,
            jobLocation: jobLocation,
            workingTime: workingTime,
            seniorityLevel: seniorityLevel,
            jobDescription: jobDescription,
            technicalSkills: technicalSkills,
            softSkills: softSkills,
            companyid: check_company._id,
            addedBy: admin,
            updatedBy: admin,
            closed: false,
        });
        await new_job.save()
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message, stack: error.stack })
    }
    res.status(201).json({ message: 'Job created successfully' });
});


// * --------<< update job info>>----------------
export const updateJob = asyncHandler(async (req, res, next) => {
    const jobId = req.params.id;
    const userId = req.user._id;
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new Error("Job not found"));
    }
    job.jobTitle = jobTitle || job.jobTitle;
    job.jobLocation = jobLocation || job.jobLocation;
    job.workingTime = workingTime || job.workingTime;
    job.seniorityLevel = seniorityLevel || job.seniorityLevel;
    job.jobDescription = jobDescription || job.jobDescription;
    job.technicalSkills = technicalSkills || job.technicalSkills;
    job.softSkills = softSkills || job.softSkills;
    const updatedJob = await job.save();
    await sendMail(
        req.user.email,
        "Job Update Confirmation",
        `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333333; margin-bottom: 10px;">Job Update Confirmation</h2>
                <p style="color: #555555; font-size: 16px;">The job has been successfully updated.</p>
                <p style="color: #555555; font-size: 16px;">Job Title: ${updatedJob.jobTitle}</p>
                <p style="color: #777777; font-size: 14px;">If you did not request this update, please contact support.</p>
            </div>
        </div>`
    );
    res.status(200).json({ msg: 'Job updated successfully', job: updatedJob });
});

// * --------<< Delete job info>>----------------
export const deleteJob = asyncHandler(async (req, res, next) => {
    let applicants = []
    const jobId = req.params.id;
    const userId = req.user._id;
    const job = await Job.findById(jobId);
    if (!job) {
        return next(new Error("Job not found"));
    }

    const Check_applicants_forthis_job = await application.find({ job: jobId }, { _id: 0, resume: 0, job: 0, __v: 0 }).populate({ path: 'user', select: '-_id ,firstName lastName email' })
    if (Check_applicants_forthis_job) {
        applicants.push(Check_applicants_forthis_job)
    }
    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ msg: 'Job deleted successfully', applicants_forthis_job_are: applicants });
});

// * --------<< get all job info & company>>----------------
export const getAllJobsWithCompany = asyncHandler(async (req, res, next) => {

    const jobs = await Job.find()
        .populate({
            path: 'companyid',
            select: 'companyName companyEmail -_id'
        })

    if (!jobs || jobs.length === 0) {
        return res.status(404).json({ msg: 'No jobs found' });
    }
    res.status(200).json({ jobs });
});

// * --------<< get all job info for specific company>>----------------
export const getJobsByCompanyName = asyncHandler(async (req, res, next) => {
    const { companyName } = req.query;
    console.log(companyName)
    if (!companyName) {
        return next(new Error('Company name is required'))
    }
    const company = await Company.findOne({ companyName: companyName });
    if (!company) {
        return next(new Error('Company not found'))
    }
    const jobs = await Job.find({ companyid: company._id });
    if (!jobs || jobs.length === 0) {
        return next(new Error('No jobs found for this company'))
    }
    res.status(200).json({ success: true, data: jobs });
});

// *------<< filter Job >>-------------
export const getFilteredJobs = asyncHandler(async (req, res, next) => {
    const page = 0
    const {
        workingTime,
        jobLocation,
        seniorityLevel,
        jobTitle,
    } = req.body;

    const query = {};
    if (workingTime) {
        query.workingTime = workingTime;
    }
    if (jobLocation) {
        query.jobLocation = jobLocation;
    }
    if (seniorityLevel) {
        query.seniorityLevel = seniorityLevel;
    }
    if (jobTitle) {
        query.jobTitle = jobTitle;
    }

    const jobs = await Job.find(query)
        .populate({ path: "companyid", select: 'companyName companyEmail' }).limit(5).skip(page * 5).sort({ createdAt: -1 });

    if (!jobs || jobs.length === 0) {
        return next(new Error('No jobs found matching the criteria'));
    }
    const currentJob = jobs.map((job) => job._id)
    console.log(currentJob)
    const user_info = await application.find({ job: currentJob }, { _id: 0, job: 0, resume: 0 }).populate({ path: 'user', select: 'firstName lastName email -_id' })
    res.status(200).json({ success: true, data: jobs, userData: user_info });
});


// *------<< apply to job >>-------------
export const applyToJob = asyncHandler(async (req, res, next) => {
    const { jobId, companyid } = req.params;
    const userId = req.user._id;

    if (!req.file) {
        return next(new Error('Resume  required'))
    }
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return next(new Error('Invalid job ID'))
    }

    const job = await Job.findById(jobId);
    if (!job) {
        return next(new Error('Invalid job ID'))
    }

    const user = await User.findById(userId);
    if (!user) {
        return next(new Error('User not found'))
    }



    const newApplication = await application.create({
        job: jobId,
        user: userId,
        resume: {
            secure_url: req.file.path,
            public_id: `resume${req.user._id}`
        },
        companyid: companyid
    });

    await job.save();

    res.status(201).json({
        msg: 'Application submitted successfully',

    });
});


//* ====================<< find Jobs for Company in Date and export into excel >>=======================
export const findJobsForComanyinDate = async (req, res, next) => {
    const { companyid, day } = req.params
    console.log(companyid, day)

    // check company in company 
    const company_data = await Company.findOne({ _id: companyid }).select("companyName")
    if (!company_data) return res.status(400).json({ msg: 'not registered company' })

    //check jobs for company in jobs
    const job_data = await Job.findOne({ companyid: companyid }).select("jobTitle")
    if (!job_data) return res.status(400).json({ msg: 'not jobs for this company' })

    


    // collect data 
    const app_info = await application.find({ createdAt: { $gte: day }, companyid: companyid }, { __V: 0, resume: 0 }).populate({
        path: 'user',
        select: 'firstName -_id'
    }).populate({
        path: 'companyid',
        select: 'companyName -_id'
    }).populate({
        path:'job', 
        select: 'jobTitle -_id'
    })


    // return res.status(400).json({data:app_info })

    try {
        if (!app_info) return res.status(400).json({ success: false, msg: 'no application exists' })
        const workbook = new exceljs.Workbook()
        const worksheet = workbook.addWorksheet("Company Jobs")
        worksheet.columns = [
            { header: "Company ID ", key: "CompanyID", width: 30 },
            { header: "Job Title ", key: "JobTitle", width: 30 },
            { header: "user ", key: "Applicant", width: 30 },
            { header: "status ", key: "Application_Status", width: 30 },
            { header: " company", key: "Company", width: 30 },

        ];

        const data_to_export = app_info.map((item) => {
            return {
                CompanyID: JSON.stringify(item._id),
                JobTitle: item.job.jobTitle,
                Applicant: item.user.firstName,
                Application_Status: item.status,
                Company: item.companyid.companyName
            }
        })

        console.log(data_to_export)

        worksheet.addRows(data_to_export)
        res.setHeader("content-type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        res.setHeader("content-Disposition", "attachment; filename=export.xlsx")
        await workbook.xlsx.write(res)
        res.end()
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

    // return res.status(200).json({ success: true , data: app_info})

}