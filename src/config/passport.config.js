import passport from "passport";
import local from "passport-local"
import usersModel from "../DAO/models/users.model.js"
import {createHash,isValidPassword} from "../utils.js"

const LocalStrategy = local.Strategy;
const initalizePassport = () =>{

    passport.use("login",new LocalStrategy({usernameField:"email"},async(username,password,done)=>{
        try{
            const user=await usersModel.findOne({email:username})
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
            const {firstName,lastName,email} = req.body;
            try{
                let user= await usersModel.findOne({email:username})
                if(user){
                    console.log("User already exists");
                    return done(null,false)
                }
                const newUser={
                    firstName,
                    lastName,
                    email,
                    isAdmin: false,
                    password:createHash(password)
                }
                let result = await usersModel.create(newUser)
                return done(null,result);
            }catch(e){
                return done("Error, failed to get user" + e)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id);
        done(null, user);
    });
}

export default initalizePassport



