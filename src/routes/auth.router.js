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

authRouter.get("/current", getSession);

authRouter.get("/logout", logout);

authRouter.get("/profile", isUser, getProfile);

authRouter.get("/admin", isUser, isAdmin, getAdmin);

authRouter.get("/login", getLogin);

authRouter.post(
   "/login",
   passport.authenticate("login", { failureRedirect: "/auth/faillogin" }),
   postLogin
);

authRouter.get("/faillogin", failLogin);

authRouter.get("/register", getRegister);

authRouter.post(
   "/register",
   passport.authenticate("register", { failureRedirect: "/auth/failregister" }),
   postRegister
);

authRouter.get("/failregister", failRegister);

authRouter.get("/verify", isUser, verifyEmail);


authRouter.get("/reqpwreset", requestPasswordResetForm);

authRouter.post("/reqpwreset", requestPasswordReset);

authRouter.get("/pwreset", passwordResetForm);

authRouter.post("/pwreset", passwordReset);

authRouter.get("/pwresetsuccess", passwordResetSuccess);

