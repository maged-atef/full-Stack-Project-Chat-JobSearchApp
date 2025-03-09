import cron from 'node-cron'
import User from '../db/models/user.model.js';


 cron.schedule("0 */6 * * *", async()=>{
    try {
        const now = new Date(); 
        console.log(now)
        const result = await User.updateMany(
            { otpExpiry : {$lt : now} },
            {$unset: {otp: "", otpExpiry : ""}}
        );
            const user = await User.findById("67c91e77599f64a93e669347")
        console.log(user.otpExpiry)
        console.log('Updated count : ',result.modifiedCount)
    } catch (error) {
        console.log('cron Error : ',error)
    }
},{
    scheduled: true, 
    timezone:"Africa/Cairo"
})