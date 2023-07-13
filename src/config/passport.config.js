    import passport from "passport";
    import local from "passport-local"
    import UsersModel from "../DAO/models/users.model.js"
    import {createHash,isValidPassword} from "../utils.js"
    import GitHubStrategy from 'passport-github2';
    import fetch from "node-fetch";
    import CartsServices from '../services/carts.services.js';

    const cartsServices = new CartsServices();

    const LocalStrategy = local.Strategy;
    const initalizePassport = () =>{

        passport.use("login",new LocalStrategy({usernameField:"email"},async(username,password,done)=>{
            try{
                const user=await UsersModel.findOne({email:username})
                if(!user){
                    console.log("User doesn't exist")
                    return done(null,false);
                }
                if(!isValidPassword(password, user.password)){
                    return done(null,false)
                }
                return done(null,user)
            }catch(e){
                return done(e)
            } 
        }))

        passport.use("register",new LocalStrategy(
            {passReqToCallback:true,usernameField:"email"},async(req,username,password,done)=>{
                const {firstName,lastName,email,age} = req.body;
                try{
                    let user= await UsersModel.findOne({email:username})
                    if(user){
                        console.log("User already exists");
                        return done(null,false)
                    }
                    const newCart = await cartsServices.createCart();
                    const cartID = newCart.result.payload._id.toString();
                    

                    const newUser = new UsersModel({
                        firstName,
                        lastName,
                        email,
                        age,
                        cart:cartID,
                        password: createHash(password),
                    });
                    let result = await newUser.save();
                    const assignUserToCart = await cartsServices.assignUserToCart(cartID, result._id);
                    return done(null,result);
                }catch(e){
                    return done("Error, failed to get user" + e)
                }
            }
        ))

        passport.use(
            'github',
            new GitHubStrategy(
                {
                    clientID: "Iv1.0a64c870063cbc1e",
                    clientSecret: process.env.GITHUB_SECRET,
                    callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
                },
                async (accesToken, _, profile, done) => {
                    console.log(profile);
                    try {
                        const res = await fetch('https://api.github.com/user/emails', {
                            headers: {
                                Accept: 'application/vnd.github+json',
                                Authorization: 'Bearer ' + accesToken,
                                'X-Github-Api-Version': '2022-11-28',
                            },
                        });
                        const emails = await res.json();
                        const emailDetail = emails.find((email) => email.verified == true);

                        if (!emailDetail) {
                            return done(new Error('cannot get a valid email for this user'));
                        }
                        profile.email = emailDetail.email;
                        
                        let user = await UsersModel.findOne({ email: profile.email });
                        if (!user) {
                            const newCart = await cartsServices.createCart();
                            const cartID = newCart.result.payload._id.toString();
                            const newUser = {
                                email: profile.email,
                                firstName: profile._json.name || profile._json.login || 'noname',
                                lastName: "nolast",
                                age:0,
                                cart:cartID,
                                password: "$%/$)#lJGITKsj(!_$:%HUB_:;mf/#)¨*",
                            };

                            let userCreated = await UsersModel.create(newUser);
                            const assignUserToCart = await cartsServices.assignUserToCart(cartID, userCreated._id);

                            // Finds the user document in the database and sets password to null
                            try {
                                const user = await UsersModel.findOneAndUpdate(
                                    { email: newUser.email },
                                    { $set: {password: null, lastName: null} },
                                    { new: true, upsert: true }
                                );
                                console.log(user);
                            } catch (err) {
                                // Handle the error
                                console.error(err);
                            }
                            console.log('User Registration succesful');
                            return done(null, userCreated);
                        } else {
                            console.log('User already exists');
                            return done(null, user);
                        }
                    } catch (e) {
                        console.log('Error en auth github');
                        console.log(e);
                        return done(e);
                    }
                }
            )
        );

        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        
        passport.deserializeUser(async (id, done) => {
            let user = await UsersModel.findById(id);
            done(null, user);
        });
    }

    export default initalizePassport






