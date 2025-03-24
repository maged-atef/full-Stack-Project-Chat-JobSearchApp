import { Router } from "express";
import * as jobService from "./job.service.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as jobValidation from "./jobValidation.js";
import { multerLocal } from "../../service/multer.js";


const router = Router();

router.post('/add', auth(['admin']),validate(jobValidation.addJobValidation), jobService.addJob);
router.patch('/updateJob/:id', auth('admin'), validate(jobValidation.updateJobValidation), jobService.updateJob);
router.delete("/delete/:id", auth('admin'), validate(jobValidation.deleteJobValidation), jobService.deleteJob);
router.get("/GetAllJob", auth(['admin', 'User']), jobService.getAllJobsWithCompany);
router.get('/specific_company', auth(['admin', 'User']), jobService.getJobsByCompanyName);
router.get('/jobsfilter', auth(['admin', 'User']), jobService.getFilteredJobs);
router.post('/apply/:jobId/:companyid', auth(['admin']), multerLocal().single("resume"), jobService.applyToJob);
router.get('/jobforcompany/:companyid/:day',  jobService.findJobsForComanyinDate);
router.get('/getallapplicatsforjob/:jobId', auth(['admin']) ,jobService.findall_applicant_forjob);

export default router;
