import nodemailer from "nodemailer";





// ^==========> create SendEmail_touser fn --------->>[from - to - subject - text - html]
export const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host:process.env.MAIL_HOST ,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE,  
        auth: {
            
            user: process.env.USER,
            pass: process.env.PASS,
        }

    });

    const mailOptions = {
        from: `"${process.env.APPNAME}" <${process.env.EMAIL}>`,
        to: to || '',
        subject: subject || 'Job Finder',
        html: html || 'Welcome',
    };

    try {
        const mail_info = await transporter.sendMail(mailOptions);
       
    } catch (error) {
        console.error('Error sending mail:', error);
    }
};
