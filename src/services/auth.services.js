import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import UsersDAO from "../DAO/Mongo/DAOS/users.dao.js";
import MailsServices from "./mails.services.js";
import { logger } from "../utils/logger.js";
import { createHash } from "../utils/utils.js";
const mailsServices = new MailsServices();
const usersDAO = new UsersDAO();

function generateResetToken() {
   return crypto.randomBytes(20).toString("hex");
}
class AuthServices {
   async requestPasswordReset(userEmail) {
      try {
         const user = await usersDAO.getUserByX({ email: userEmail });
         if(user.loginType!="Normal"){
            user.password = uuidv4()
         }

         if (!user) {
            return {
               status: 404,
               result: {
                  status: "error",
                  msg: "User Not Found",
                  payload: {},
               },
            };
         }
         const resetToken = generateResetToken();
         user.pwRToken = resetToken;
         user.pwRTokenExpire = new Date(Date.now() + 3600000); // 1 hour expiration

         await user.save();
         await mailsServices.sendPasswordResetEmail(userEmail, resetToken);
         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Password reset email sent.",
               payload: {},
            },
         };
      } catch (error) {
         logger.error(`${error.stack}`);
         return {
            status: 500,
            result: {
               status: "Error",
               msg: "Internal Server Error",
               payload: {},
            },
         };
      }
   }

   async resetPassword(token, newPassword) {
      try {
         const user = await usersDAO.getUserByX({ pwRToken: token });
         if (!user) {
            return {
               status: 400,
               result: {
                  status: "Error",
                  msg: "User Not Found",
                  payload: {},
               },
            };
         }

         const now = new Date();
         if (user.pwRTokenExpire < now) {
            return {
               status: 400,
               result: {
                  status: "Error",
                  msg: "Token Expired",
                  payload: {},
               },
            };
         }
         const hashedPassword = await createHash(newPassword);
         user.password = hashedPassword;
         user.pwRToken = null;
         user.pwRTokenExpire = null;
         user.loginType= "Normal"

         await user.save();

         return {
            status: 200,
            result: {
               status: "Success",
               msg: "Password reset successfully",
               payload: {},
            },
         };
      } catch (error) {
         return {
            status: 500,
            result: {
               status: "Error",
               msg: "Internal Server Error",
               payload: {error},
            },
         };
      }
   }
}

export default AuthServices;
