const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.create = (req,res) => {
    console.log(req.body.post);
    
    Post.findById(req.body.post, (err,post)=> {
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            } , (err, comment) => {
                if(err){
                    //handle error if comment not created
                    
                }
                post.comments.push(comment);
                post.save();

                res.redirect('/');
            })
        }
    })    
}

module.exports.destroy = (req,res) => {
    Comment.findById(req.params.id , (err,comment) => {

        //if the same user which has commented,is logged in. then delete it!
        if(comment.user == req.user.id){
            
            /*upon finding the required comment, we need to go into post schema as well, in that particular post's array of comments,
            we need to find the same comment id and delete it from there as well
            So overall, we delete Comment from comment collection and comment id from Post document's comment array.
            */

            let postId = comment.post;

            comment.remove();

            //find post by postId and pull out comments array and update the comments array by removing the id
            Post.findByIdAndUpdate(postId , {
                $pull: {comments: req.params.id}
            } , (err, post) => {
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    })
}