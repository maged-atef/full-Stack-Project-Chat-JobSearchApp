import { Router } from "express";
import * as companyService from "./company.service.js";
import { auth } from '../../middelware/auth.js'
import { multerLocal } from "../../service/multer.js";
import * as companyValidation from './companyValidation.js'
import { validate } from "../../middelware/validation.js";



const router = Router();
const upload = multerLocal() 


router.post('/add',                   auth(['admin']),validate(companyValidation.addCompanyValidation), companyService.addCompany);
router.patch("/update/:id",           auth(['admin']),validate(companyValidation.updateCompanyValidation), companyService.updateCompany);
router.delete("/delete/:id",          auth(['admin']),validate(companyValidation.deleteCompanyValidation), companyService.deleteCompany);
router.post('/uploadlogo/:companyId', auth(['admin']), upload.single("logo"), companyService.uploadlogo);
router.post('/uploadcover/:companyId',auth(['admin']), upload.single("coverPic"),companyService.uploadcover);
router.delete('/dellogo/:companyId',  auth(['admin']), companyService.dellogo);
router.delete('/delcover/:companyId', auth(['admin']), companyService.delcover);
router.get('/info/:companyId',        auth(['admin']), companyService.companybyID);
router.get("/search",                 auth(['admin','User']),validate(companyValidation.searchCompanyValidation) ,companyService.searchCompanyByName);
router.get('/company/:companyId',     auth(['admin']), companyService.getCompanyDataAndJobs);
router.get('/application/:jobId',     auth(['admin']), companyService.getApplicationsForJob);



export default router;
