const Post = require('../models/post');

module.exports.posts = (req,res) => {
   
    //populate the user of each post
    Post.find({}).populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }) 
    .exec((err,posts) => {
        return res.render('home', {
            title: 'Codeial | News-Feed',
            posts: posts
        })
    })

}

module.exports.create = (req,res) => {
  

    Post.create({
        content: req.body.content,
        user: req.user._id
    }, (err,post) => {
        if(err){
            console.log(`Error in creating a post, ${err}`);
            return;
        }
        console.log(post);
        
        return res.redirect('back');
    })
}