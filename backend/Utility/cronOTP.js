import cron from 'node-cron'
import User from '../db/models/user.model.js';


 cron.schedule("0 */6 * * *", async()=>{
    try {
        const now = new Date(); 
       
        const result = await User.updateMany(
            { otpExpiry : {$lt : now} },
            {$unset: {otp: "", otpExpiry : ""}}
        );
       
    } catch (error) {
        console.log('cron Error : ',error)
    }
},{
    scheduled: true, 
    timezone:"Africa/Cairo"
})