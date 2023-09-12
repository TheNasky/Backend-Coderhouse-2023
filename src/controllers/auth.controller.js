import UsersDAO from "../DAO/Mongo/DAOS/users.dao.js";
import AuthServices from "../services/auth.services.js";
import { logger } from "../utils/logger.js";

const usersDAO = new UsersDAO();
const authServices = new AuthServices();

export const getSession = (req, res) => {
   return res.send(JSON.stringify(req.session));
};

export const logout = (req, res) => {
   req.session.destroy((err) => {
      if (err) {
         return res.status(500).render("error", { error: "Failed to end session" });
      }
      return res.redirect("/auth/login");
   });
};

export const getProfile = (req, res) => {
   return res.render("profile", { user: req.session.user });
};

export const getAdmin = (req, res) => {
   return res.send("WIP");
};

export const getLogin = (req, res) => {
   return res.render("login", {});
};

export const postLogin = async (req, res) => {
   if (!req.user) {
      return res.json({ error: "invalid credentials" });
   }
   req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      cart: req.user.cart,
      roles: req.user.roles,
   };
   if (req.user.vfToken != 0) {
      req.session.user.vfToken = req.user.vfToken;
   }
   return res.status(200).redirect("../products");
};

export const failLogin = async (req, res) => {
   return res.json({ error: "fail to login" });
};

export const getRegister = (req, res) => {
   return res.render("register", {});
};

export const postRegister = async (req, res) => {
   if (!req.user) {
      return res.json({ error: "Something went wrong :(" });
   }
   req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      cart: req.user.cart,
      roles: req.user.roles,
   };
   if (req.user.vfToken != 0) {
      req.session.user.vfToken = req.user.vfToken;
      await mailsServices.sendVerificationEmail(req.user.email, req.user.vfToken);
   }

   return res.status(200).redirect("profile");
};

export const failRegister = async (req, res) => {
   return res.json({ error: "Failed to register" });
};

export const verifyEmail = async (req, res) => {
   const verificationToken = req.query.token;
   try {
      const user = await usersDAO.getUserByX({ vfToken: verificationToken });
      if (!user) {
         return res
            .status(400)
            .json({ status: "error", msg: "Invalid Verification Token", payload: {} });
      }
      //TODO Agregar expiracion al token
      await usersDAO.updateUserWith({ _id: user._id }, { isVerified: true, vfToken: 0 });
      return res.status(200).json({
         status: "Success",
         msg: "Email Verified successfuly",
         payload: {},
      });
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};
export const requestPasswordResetForm = async (req, res) => {
   try {
      res.status(200).render("requestPassword")
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};
export const requestPasswordReset = async (req, res) => {
   try {
      const email = req.body.email;
      const result = await authServices.requestPasswordReset(email);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};

export const passwordResetForm = async (req, res) => {
   try {
      const { token } = req.query;
      res.status(200).render("pwreset")
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};
export const passwordReset = async (req, res) => {
   try {
      const { token} = req.query;
      const { password } = req.body;
      const result = await authServices.resetPassword(token,password);
      res.status(result.status).json(result.result);
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
}
export const passwordResetSuccess = async (req, res) => {
   try {
      const { token } = req.query;
      res.status(200).render("pwresetsuccess")
   } catch (error) {
      logger.error(`${error.stack}`);
      res.status(500).json({
         status: "error",
         msg: "Something went wrong :(",
      });
   }
};
