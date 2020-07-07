const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');


module.exports.posts =  async (req,res) => {
   
    try {
         //populate the user of each post
        let posts = await Post.find({}).populate('user')
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
        await Post.create({
            content: req.body.content,
            user: req.user._id
        })

        return res.redirect('back');
    } catch(err){
        console.log(`Error in creating post, ${err}`);
    }
}

module.exports.destroy = async (req,res) => {
    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();

            //.deletMany() will delete all records
        await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        }
        else{ 
            return res.redirect('back');
        }
    } catch(err){
        console.log(`Error in creating post, ${err}`);
    }
}