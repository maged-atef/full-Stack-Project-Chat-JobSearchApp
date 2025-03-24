import { Router } from "express";
import * as userService from "./user.service.js";
import { auth } from "../../middelware/auth.js";
import { validate } from "../../middelware/validation.js";
import * as userValidation from "./userValidation.js";
import { multerLocal } from "../../service/multer.js";
import "../../../Utility/passport.js";
import passport from "passport";
import jwt from 'jsonwebtoken'



const router = Router();

router.post("/signup", validate(userValidation.signupValidation), userService.signup);
router.post("/confirm", userService.confirmEmail);
router.post("/signin", validate(userValidation.signinValidation), userService.signin);
router.patch("/update", auth(['admin']), validate(userValidation.updateAccountValidation), userService.update);
router.get("/getacc", auth(['admin']), userService.getAcc);
router.get("/profile/:id",auth(['User']) ,userService.GetProfile);
router.post("/requestPasswordReset", validate(userValidation.requestPasswordResetValidation), userService.requestPasswordReset);
router.post("/resetPassword", validate(userValidation.resetPasswordValidation), userService.resetPassword);
router.patch('/updatePassword', auth(["admin", "User"]), validate(userValidation.updatePasswordValidation), userService.updatePassword);
router.post("/uploadcoverpic", auth(['User', 'admin']), multerLocal().single("coverPic"), userService.Upload_Cover_pic);
router.post("/uploadprofilepic", auth(['User', 'admin']), multerLocal().single("profilePic"), userService.upload_profile_pic);
router.delete("/deleteprofilepic", auth(['User', 'admin']), userService.Delete_ProfilePic);
router.delete("/deletecoverpic", auth(['User', 'admin']), userService.Delete_CoverPic);
router.post('/signupGoogle', userService.signupGoogle)
router.delete("/deleteaccount", auth(['User', "admin"]), userService.Delete_UserAccount);
router.get("/getaccsoft", auth("admin"), userService.getsoftDeleted);

// HR Accept and Reject Applicants
router.post('/hrResponseApplication', auth(['admin']), userService.hrResponse_toApplication)

// refreshToken
router.post('/refreshtoken', auth(['User', 'admin']), userService.refreshtoken)

// banned user 
router.patch('/banned', auth(['admin']), userService.banned_user)

// Google OAuth Route use browser not postman 
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, "SECRETKEY", { expiresIn: "1h" });
        res.redirect(`http://localhost:3000/user/googlelogin/${token}`); // Redirect to frontend
    }
);

router.get('/googlelogin/:token', userService.googlein)
export default router;
