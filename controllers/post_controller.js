const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const path = require('path');
const fs = require('fs');

module.exports.posts =  async (req,res) => {
   
    try {
         //populate the user of each post
        let posts = await Post.find({}).populate('user')
        .sort('-createdAt')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        }) 
        let users = await  User.find({});
        
        return res.render('home', {
            title: 'Codeial | News-Feed',
            posts: posts,
            all_users: users
        })
    } catch(err){
        console.log(`Error in finding post, ${err}`)
    }
  
}

module.exports.create = async (req,res) => {
  

    try {
       
        Post.uploadPost(req, res, (err) => {
            if(err){ 
                console.log('*************** Error in multer ************', err);
                req.flash('error', err.toString());
                return res.redirect('back');
            }

            let post = new Post();

            post.content = req.body.content;
            post.user = req.user._id;
            
            if(req.file){

               post.picture = Post.postPath+'/'+req.file.filename;
            }

             Post.create(post);
            req.flash('success', "Post published!");
            return res.redirect('back');
        })
        
       
    } catch(err){
        req.flash('error', err);
        console.log(`Error in creating post, ${err}`);
        return res.redirect('back');
    }
}

module.exports.destroy = async (req,res) => {
    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();

            //.deletMany() will delete all records
        await Comment.deleteMany({post: req.params.id});
        req.flash('success', "Post Deleted!");
        return res.redirect('back');
        }
        else{ 
        req.flash('error', "Post couldn't be deleted!")
            return res.redirect('back');
        }
    } catch(err){
        req.flash('error', err);
        console.log(`Error in creating post, ${err}`);
        return res.redirect('back');
    }
}