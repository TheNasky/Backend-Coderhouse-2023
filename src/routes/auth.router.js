import { Router } from "express";
import { isAdmin, isUser } from "../middlewares/auth.js";
import passport from "passport";
import {
   getSession,
   logout,
   getProfile,
   getAdmin,
   getLogin,
   postLogin,
   failLogin,
   getRegister,
   postRegister,
   failRegister,
   verifyEmail,
   requestPasswordReset,
   requestPasswordResetForm,
   passwordResetForm,
   passwordReset,
   passwordResetSuccess
} from "../controllers/auth.controller.js";

export const authRouter = Router();

// Get current session
authRouter.get("/current", getSession);

// Logout user
authRouter.get("/logout", logout);

// Get user profile
authRouter.get("/profile", isUser, getProfile);

// Get admin panel (requires admin privileges)
authRouter.get("/admin", isUser, isAdmin, getAdmin);

// Get login page
authRouter.get("/login", getLogin);

// Handle login form submission
authRouter.post(
   "/login",
   passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
   postLogin
);

// Login failure route
authRouter.get("/faillogin", failLogin);

// Get registration page
authRouter.get("/register", getRegister);

// Handle registration form submission
authRouter.post(
   "/register",
   passport.authenticate("register", { failureRedirect: "/auth/failregister" }),
   postRegister
);

// Registration failure route
authRouter.get("/failregister", failRegister);

// Verify email for a user
authRouter.get("/verify", isUser, verifyEmail);

// Request password reset form
authRouter.get("/reqpwreset", requestPasswordResetForm);

// Handle password reset request
authRouter.post("/reqpwreset", requestPasswordReset);

// Password reset form
authRouter.get("/pwreset", passwordResetForm);

// Handle password reset
authRouter.post("/pwreset", passwordReset);

// Password reset success route
authRouter.get("/pwresetsuccess", passwordResetSuccess);
