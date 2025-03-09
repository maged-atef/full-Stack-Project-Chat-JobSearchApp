import nodemailer from "nodemailer";


const ownermail = "maged.atef.arteen@gmail.com"



// ^==========> create SendEmail_touser fn --------->>[from - to - subject - text - html]
export const sendMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,  // or false with port 587
        auth: {
            // Gmail Email
            user: "maged.atef.arteen@gmail.com",
            pass: "yglr vdma wich tyso",
        }

    });

    const mailOptions = {
        from: `"Job Search Platform" <${ownermail}>`,
        to: to || '',
        subject: subject || 'Job Finder',
        html: html || 'Welcome',
    };

    try {
        const mail_info = await transporter.sendMail(mailOptions);
        // console.log('Mail sent:', mail_info);
    } catch (error) {
        console.error('Error sending mail:', error);
    }
};
