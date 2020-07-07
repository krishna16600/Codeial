const User = require('../models/user');

module.exports.profile = function(req,res){

    User.findById(req.params.id , (err,user) => {
        return res.render('user' , {
            title: "User",
            profile_user: user
        })
    })
  
}

//render sign up page
module.exports.signUp = function(req, res) {

    if(req.isAuthenticated()) {
       return  res.redirect('/users/profile');
    }
    return res.render('user_sign_up' , {
        title: "Codeial | Sign Up"
    })
}

//render sign in page
module.exports.signIn = function(req, res) {
    
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_in' , {
        title: "Codeial | Sign In"
    })
}

//creating a user and getting up sign up dara
module.exports.create = function(req , res) {
    if(req.body.password != req.body.confirm_password)
        return res.redirect('back');
    
    User.findOne({email: req.body.email}, function(err, user) {
        if(err){
            console.log(`Error in signing up user ${err}`);
            return res.redirect('/users/sign-up');
        }
             
            if(!user){
                User.create(req.body, (err,user)=>{
                    if(err){
                        console.log(`Error in signin up user ${err}`);
                        return res.redirect('/users/sign-up');
                    } 
                    return res.redirect('/users/sign-in');
                })
            }
            else{
                return res.redirect('back');
            }
        })
}

//creating session and signin in
module.exports.createSession = function(req,res){
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = (req,res) => {

    req.logout();
    req.flash('success' , 'You have logged out!');
    return res.redirect('/');
}

module.exports.updateProfile = (req, res) => {

    User.findById(req.params.id , (err,user) => {
        if(user) {
            return res.render('user_profile', {
                title: "User-Profile",
                user_profile: user
            })
        }
    })
}

module.exports.updateDetails = (req,res) => {
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id , req.body, (err, user) => {
            return res.redirect('back');
        })
    } else{
        res.status(401).send('Unauthorized');
    }
}