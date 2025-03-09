import mongoose from 'mongoose';
import '../Utility/cronOTP.js'
//* Connect to Db
const connectiontDB = async () => {
    return await mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('✔ 🟢 Mongoose Db is Connected Successfully ');
            console.log(`------------------------------------------------------`)
        })
        .catch((err) => {
            console.log({ msg: '❌ 🔴 Mongoose Db connection Error: ', err });
        });
};

export default connectiontDB;
