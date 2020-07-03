const User = require('../models/user');

module.exports.profile = function(req,res){

    if(req.cookies.user_id){
        User.findById(req.cookies.user_id , (err,user)=>{
            if(err){

            }

            if(user){
                return res.render('user' , {
                    title: "User profile",
                    user: user
                })
            }

            return res.redirect('/users/sign-in');
        })
    }else{
        return res.redirect('/users/sign-in');
    }

   
}

//render sign up page
module.exports.signUp = function(req, res) {
    return res.render('user_sign_up' , {
        title: "Codeial | Sign Up"
    })
}

//render sign in page
module.exports.signIn = function(req, res) {
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

    //find the user
    User.findOne({email: req.body.email} , (err, user) => {
        if(err){
            console.log(`Error in signing in user ${err}`);
            return res.redirect('/users/sign-in');
        }

        //handle user if found
        if(user){
            //hanlde password which dont match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');


        } else{
        //handle user if not found
        
        }
    })





}

module.exports.signOut = function(req, res){
    res.clearCookie('user_id');
    res.redirect('/users/sign-in');
}