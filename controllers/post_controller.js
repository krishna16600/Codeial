const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');


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

        User.find({} , (err,users) => {
            return res.render('home', {
                title: 'Codeial | News-Feed',
                posts: posts,
                all_users: users
            })
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


module.exports.destroy = (req,res) => {
    Post.findById(req.params.id, (err,post) => {
        
        //if found and check if user is same as author
        //when comparing two id's , we need to convert it into strings, ideally it should be req.user._id but it's an object and we need
        // to convert it into string. mongoose provides us the functionality and we can simply write as below
        if(post.user == req.user.id){
                post.remove();

                //.deletMany() will delete all records
                Comment.deleteMany({post: req.params.id} , (err) => {
                    if(err){
                        return res.redirect('back');
                    }
                })

                return res.redirect('back');
        }
        else 
            return res.redirect('back');
    })
}