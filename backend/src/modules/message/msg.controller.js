import { Router } from "express";
import * as msgService from './msg.service.js'
import { auth } from "../../middelware/auth.js";


const router = Router() 

router.post('/send', auth(['admin']),msgService.sendmsg)
router.get('/getallmsg/:userid', auth(['admin', 'User']),msgService.getallmsg)

export default router 