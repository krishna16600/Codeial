const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken,
    secretOrKey: 'codeial'
}

passport.use(new JWTStrategy(options , (jwtPayLoad, done) => {

    User.findById(jwtPayLoad._id , (err, user) => {
        if(err) {
            console.log('Error in finding User from JWT');
            return;
        }
        
        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })
    
}))


module.exports = passport;