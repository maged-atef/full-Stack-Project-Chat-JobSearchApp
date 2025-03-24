import { sendMail } from "../../service/email.js";
import Company from "../../../db/models/company.model.js";
import Job from "../../../db/models/job.model.js";
import CLOUD from "../../service/cloudinary.js";
import Application from "../../../db/models/application.model.js";
import path from 'path'
import application from "../../../db/models/application.model.js";
import dotenv from 'dotenv'
dotenv.config({path:path.resolve('.env')})
console.log(path.resolve('.env'))

// Async Handler
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.error(err); // Log error details to the console
            res.status(500).json({ msg: "catch error", err: err.message || err });
        });
    };
};
//*=========>> Add Company
export const addCompany = asyncHandler(async (req, res, next) => {
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
   const admin = req.user._id
    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
        return res.status(400).json({ msg: 'Company already exists' });
    }
    const newCompany = await Company.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        admin
    });
    res.status(201).json({ message: 'Company created successfully', company: newCompany });
});

//*==========>> Update Company
export const updateCompany = asyncHandler(async (req, res, next) => {
    const companyId = req.params.id;
    const userId = req.user._id;
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new Error("Company not found"));
    }
    if (companyName) company.companyName = companyName;
    if (description) company.description = description;
    if (industry) company.industry = industry;
    if (address) company.address = address;
    if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees;
    if (companyEmail) company.companyEmail = companyEmail;
    await company.save();
    await sendMail(
        req.user.email,
        "Company Update Confirmation",
        `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333333; margin-bottom: 10px;">Company Update Confirmation</h2>
                <p style="color: #555555; font-size: 16px;">Your company details have been successfully updated.</p>
                <p style="color: #555555; font-size: 16px;">Company Name: ${company.companyName}</p>
                <p style="color: #555555; font-size: 16px;">Description: ${company.description}</p>
                <p style="color: #555555; font-size: 16px;">Industry: ${company.industry}</p>
                <p style="color: #555555; font-size: 16px;">Address: ${company.address}</p>
                <p style="color: #555555; font-size: 16px;">Number of Employees: ${company.numberOfEmployees}</p>
                <p style="color: #555555; font-size: 16px;">Company Email: ${company.companyEmail}</p>
                <p style="color: #777777; font-size: 14px;">If you did not request this update, please contact support.</p>
            </div>
        </div>`
    );
    res.status(200).json({ msg: 'Company updated successfully', company });
});

//*==========>> Delete Company
export const deleteCompany = asyncHandler(async (req, res, next) => {
    const companyId = req.params.id;
    const userId = req.user._id;
    const company = await Company.findById(companyId);
    if (!company) {
        return next(new Error("Company not found"));
    }

  await company.deleteOne()


    await sendMail(
        req.user.email,
        "Company Deletion Confirmation",
        `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; max-width: 500px; margin: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                <h2 style="color: #333333; margin-bottom: 10px;">Company Deletion Confirmation</h2>
                <p style="color: #555555; font-size: 16px;">Your company has been successfully deleted.</p>
                <p style="color: #555555; font-size: 16px;">Company Name: ${company.companyName}</p>
                <p style="color: #777777; font-size: 14px;">If you did not request this deletion, please contact support.</p>
            </div>
        </div>`
    );
    res.status(200).json({ msg: 'Company deleted successfully' });
});

// *======>> Search Company by Name, Email, or Industry
export const searchCompanyByName = asyncHandler(async (req, res, next) => {
    const { companyName, companyEmail, industry } = req.query;
    if (!companyName && !companyEmail && !industry) {
        return res.status(400).json({ msg: "At least one search parameter (companyName, companyEmail, or industry) is required" });
    }
    const query = {};

    if (companyName) {
        const regex = new RegExp(companyName, 'i');
        query.companyName = { $regex: regex };
    }
    if (companyEmail) {
        query.companyEmail = companyEmail;
    }
    if (industry) {
        query.industry = industry;
    }
    const companies = await Company.find(query);
    if (companies.length === 0) {
        return res.status(404).json({ msg: "No companies found with the specified criteria" });
    }
    res.status(200).json({ companies });
});

// *=========>> Get Company Data and Jobs
export const getCompanyDataAndJobs = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
    if (!companyId) {
        return res.status(400).json({ msg: 'Company ID is required' });
    }
    const job = await Job.find({companyid : companyId}).populate("companyid")
    if (!job) {
        return res.status(404).json({ msg: 'not job exists for this Company' });
    }
    
    res.status(200).json({
        job
      
    });
});

//*=======>>  Get Applications for a Job
export const getApplicationsForJob = asyncHandler(async (req, res, next) => {
    const {jobId} = req.params;
    const userId = req.user._id;

    const job = await application.find({job:jobId}, {_id :0 , createdAt: 0, updateAt: 0, resume:0, __v:0 })
        .populate({path: "user", select: 'firstName -_id'});

    if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
    }
   if (job.length <1 ) return res.status(400).json({success: false , msg : 'no applications exists'})
    res.status(200).json({success: true , data : job});
});




//* -----> upload logo
export const uploadlogo = async (req, res, next) => {
    const file = req.file
    const userId = req.user._id
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId})

    if(!req.file) return res.status(400).json({success: false , msg: "no logo picture provided"})

      try {
        const uploadCloud = await CLOUD.uploader.upload(req.file.path, {folder: `/logoPicture`})
       
        company.logo = {
            secure_url: uploadCloud.secure_url,
            public_id: uploadCloud.public_id
        }
        await company.save()
       return res.status(200).json({ success: true, msg: 'logo company changed ' , data:company})
      } catch (error) {
        return res.status(400).json({err: error.message, stack: error.stack})
      }
   

}

//* -----> upload cover  
export const uploadcover= async (req, res, next) => {
    const file = req.file
    const userId = req.user._id
    const {companyId} = req.params
    const company = await Company.findOne({_id: companyId})
    if(!req.file) return res.status(400).json({success: false , msg: "no cover picture provided"})

        
      try {
        const uploadCloud = await CLOUD.uploader.upload(req.file.path, {folder: `/coverPicture`})
       
        company.coverPic = {
            secure_url: uploadCloud.secure_url,
            public_id: uploadCloud.public_id
        }
        await company.save()
       return res.status(200).json({ success: true, msg: 'cover is updated' , data:company})
      } catch (error) {
        return res.status(400).json({err: error.message, stack: error.stack})
      }



}

//* -----> delete cover 
export const delcover = async (req, res, next) => {
    const userId = req.user._id
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId})

    if (company.coverPic.secure_url.startsWith("Default")) return res.status(200).json({ success: false, msg: 'no cover picture' })

    try {
        const deleteCover = await CLOUD.uploader.destroy(company.coverPic.public_id)
        company.coverPic.secure_url = "Default Cover picture"
        company.coverPic.public_id = "Default id"
      
    await company.save()

    res.status(200).json({ success: true, msg:"cover picture deleted" , data:company})

    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//* -----> delete logo 
export const dellogo = async (req, res, next) => {
    const userId = req.user._id
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId})

    if (company.logo.secure_url.startsWith("Default")) return res.status(200).json({ success: false, msg: 'no cover picture' })

        try {
            const deletelogo = await CLOUD.uploader.destroy(company.logo.public_id)
            company.logo.secure_url = "Default logo picture"
            company.logo.public_id = "Default id"
          
        await company.save()
    
        res.status(200).json({ success: true, msg:"cover picture deleted" , data:company})
    
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

}



//* -----> company by ID 
export const companybyID = async (req, res, next) => {
    const userId = req.user._id
    const {companyId} = req.params

    const company = await Company.findOne({_id: companyId})

    if (!company) return res.status(200).json({ success: false, msg: 'no registered company' })

  

    res.status(200).json({ success: true, msg:"company exists ", data: company})

}