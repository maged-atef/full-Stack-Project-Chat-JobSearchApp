import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import CryptoJS from "crypto-js";

import User from "../db/models/user.model.js"; // Import User model



 passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: ` ${process.env.HOST}user/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value,
                provider:'google',
                mobileNumber:  '12',
                password:"123456",
                lastName:"userLast" ,
                role:'User',
                DOB:"2000-01-01",
               
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
