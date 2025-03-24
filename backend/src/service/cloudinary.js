import { v2 as CLOUD } from 'cloudinary'




    

    CLOUD.config({
        cloud_name: process.env.APP_NAME,
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET
    })


export default CLOUD