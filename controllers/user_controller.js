const User = require('../models/user');
const path = require('path');
const fs = require('fs');

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

module.exports.updateDetails = async (req,res) => {
    if(req.user.id == req.params.id){
      
        try{    
            let user = await User.findById(req.params.id);

            User.updateAvatar( req, res, function(err){
                if(err){console.log(err);}

                user.name = req.body.name;
                user.email = req.body.email;
                user.password = req.body.password;
                user.bio = req.body.bio;
                if(req.file){

                    console.log('file exists ' , fs.existsSync(path.join(__dirname , '..' , user.avatar)));

                    if(user.avatar && fs.existsSync(path.join(__dirname , '..' , user.avatar))){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }
                   
                    user.avatar = User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                req.flash('success', 'Profile Updated');
                return res.redirect('back');
            })
        }catch(err) {
            console.log(err);
            return res.redirect('back');
        }
        
    } else{
        res.status(401).send('Unauthorized');
    }
}
//avatar-1594404256352