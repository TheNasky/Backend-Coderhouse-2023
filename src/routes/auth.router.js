import { Router } from "express";
import UsersModel from "../DAO/models/users.model.js";
import { isAdmin, isUser } from '../middlewares/auth.js';

export const authRouter = Router();


authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: "Session not found" });
      }
      return res.redirect('/auth/login');
    });
  });
  
  authRouter.get('/profile', isUser, (req, res) => {
    const user = { email: req.session.email, isAdmin: req.session.isAdmin };
    return res.render('profile', { user: user });
  });
  
  authRouter.get('/admin', isUser, isAdmin, (req, res) => {
    return res.send('WIP');
  });
  
  authRouter.get('/login', (req, res) => {
    return res.render('login', {});
  });
  
  authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render('error', { error: 'Please type your E-Mail address and password' });
    }
    const user= await UsersModel.findOne({ email: email });
    if (user && user.password == password) {
      req.session.email = user.email;
      req.session.isAdmin = user.isAdmin;
  
      return res.redirect('/auth/profile');
    } else {
      return res.status(401).render('error', { error: 'E-Mail not found or wrong password' });
    }
  });
  
  authRouter.get('/register', (req, res) => {
    return res.render('register', {});
  });
  
  authRouter.post('/register', async (req, res) => {
    const { email, username, password,  } = req.body;
    if (!email || !username || !password) {
      return res.status(400).render('error', { error: "Please complete all fields" });
    }
    try {
      await UsersModel.create({ email: email, username:username, password: password, isAdmin: false });
      req.session.email = email;
      req.session.isAdmin = false;
  
      return res.redirect('/auth/profile');
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "error",
            msg: "Something went wrong :(",
        });
    }
  });