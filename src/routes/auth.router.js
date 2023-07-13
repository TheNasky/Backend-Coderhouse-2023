import { Router } from "express";
import UsersModel from "../DAO/models/users.model.js";
import { isAdmin, isUser } from '../middlewares/auth.js';
import passport from "passport";

export const authRouter = Router();

authRouter.get('/session', (req, res) => {
  return res.send(JSON.stringify(req.session));
});


authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
    }
    return res.redirect('/auth/login');
  });
});
  
authRouter.get('/profile', isUser, (req, res) => {
  const user = { email: req.session.user.email, isAdmin: req.session.user.isAdmin };
  return res.render('profile', { user: user });
});
  
authRouter.get('/admin', isUser, isAdmin, (req, res) => {
  return res.send('WIP');
});
  
authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});
  
authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'invalid credentials' });
  }
  req.session.user = {
    _id: req.user._id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    age: req.user.age,
    cart:req.user.cart};

  return res.status(200).redirect("../products");
});

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'fail to login' });
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});
  
authRouter.post('/register', passport.authenticate("register", { failureRedirect: '/auth/failregister' }), (req, res) => {
  if (!req.user) {
    return res.json({ error: 'Something went wrong :(' });
  }
  req.session.user = {
    _id: req.user._id,
    email: req.user.email,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    age: req.user.age,
    cart:req.user.cart};
  
  return res.status(200).redirect("profile");
});

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'Failed to register' });
});

