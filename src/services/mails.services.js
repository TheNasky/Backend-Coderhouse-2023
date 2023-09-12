import nodemailer from "nodemailer";
import __dirname from "../../__dirname.js";

const transport = nodemailer.createTransport({
   service: "gmail",
   port: 587,
   auth: {
      user: process.env.MAIL_SENDER,
      pass: process.env.MAIL_PASS,
   },
});

class MailsServices {
   async sendVerificationEmail(email, verificationToken) {
      const verificationLink = `http://localhost:8080/auth/verify?token=${verificationToken}`;

      try {
         await transport.sendMail({
            from: "TheNasky",
            to: email,
            subject: "Verify your Account",
            html: `
               <div>
                  <h1>Please verify your account by clicking the following link:</h1>
                  <a href="${verificationLink}">Verify Email</a>
                  <img src="cid:emoji1"/>
               </div>
            `,
            attachments: [
               {
                  filename: "emoji.png",
                  path: __dirname + "/src/public/img/emoji.png",
                  cid: "emoji1",
               },
            ],
         });
         console.log("Email Sent");
      } catch (error) {
         console.error("Email sending failed:", error);
      }
   }
   async sendPasswordResetEmail(email, resetToken) {
      const resetLink = `http://localhost:8080/auth/pwreset?token=${resetToken}`;
   
      try {
         await transport.sendMail({
            from: "TheNasky",
            to: email,
            subject: "Password Reset",
            html: `
               <div>
                  <h1>Password Reset</h1>
                  <p>You can reset your password by clicking the following link:</p>
                  <a href="${resetLink}">Reset Password</a>
               </div>
            `,
         });
         console.log("Password reset email sent");
      } catch (error) {
         console.error("Password reset email sending failed:", error);
      }
   }
}

export default MailsServices;
