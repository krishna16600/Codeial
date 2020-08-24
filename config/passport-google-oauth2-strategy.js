const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


//tell passport to use the new strategy for google login
passport.use(new googleStrategy({
    clientID: "807324829226-ecmt54sodeiiivpoce7ou5b92mqitrqh.apps.googleusercontent.com",
    clientSecret: "88ad17dpUFETXYSchnfRCmPz",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
} , 
    (accessToken , refreshToken , profile , done)  => {
        //find a user
            User.findOne({email: profile.emails[0].value}).exec( (err , user) => {
                if(err){
                    console.log('error in google strategy', err)
                    return;
                } 

                console.log(profile)
                //if found then set this user as req.user
                if(user)
                    return done(null, user);
                else{
                    //if not found, then create a new user and set it as req.user
                    User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    } , (err,user) => {
                        if(err){
                            console.log('error in creating user using google oauth');
                        } 

                        return done(null, user);
                    })
                }

            } )
    }
));

module.exports = passport;