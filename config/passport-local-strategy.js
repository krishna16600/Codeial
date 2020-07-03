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


// check if the user is AUTHENTICATED
passport.checkAuthentication = (req,res,next) => {
    //if the user is signed in then pass on the request to the next function (controller's action)

    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

// check if user is signed In
passport.setAuthenticatedUser = (req,res,next) => {
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;