const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


//Authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email' //in the schema, same should be here
    },
    function(email,password,done){
        //find a user and establish the identity
        User.findOne({email: email} , (err,user) => {
            if(err){
                console.log(`Error in finding user, ${err} --> Passport`);
                return done(err);
            }

            if(!user || user.password != password){
                console.log("Invalid Username/Password");
                return done(null,false);
                //if there is any error(null) and authentication is false
            }

            return done(null,user);
        })
    }

))


//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser( (user, done) => {

    //automatically encrypts the user id
    done(null,user.id);
})



//deserialize the user from the key in the cookies
passport.deserializeUser((id,done) => {
    User.findById(id , (err,user) => {
        if(err){
            console.log(`Error in finding user, ${err} --> Passport`);
            done(err);
        }

        return done(null,user);
    })
})

module.exports = passport;