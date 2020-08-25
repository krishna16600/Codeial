const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comment_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');

module.exports.create = async (req,res) => {

    try{
    let post = await Post.findById(req.body.post); 

    if(post){
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

            post.comments.push(comment);
            post.save();
            
            //pre populating user in comment
            comment = await comment.populate('user', 'name email').execPopulate();
            
            //sending email
            //commentsMailer.newComment(comment);
            //this is done by redis and kue
           let job =  queue.create('emails' , comment).save( err => {
                    if(err){
                        console.log('error in queue');
                        return;
                    }

                    console.log('job enqueued', job.id);

            })

            req.flash('success' , 'Comment Added!');
            res.redirect('/');
        }
    } catch(err) {
        req.flash('error' , err);
        console.log(`Error in adding comment, ${err}`);
    }
}   

module.exports.destroy = async (req,res) => {
     
    try{
            let comment = await Comment.findById(req.params.id);
            let post = await Post.findById(comment.post);
            
            //if the same user which has commented,is logged in. then delete it!
            if(comment.user == req.user.id || post.user == req.user.id){
                
                
                /*upon finding the required comment, we need to go into post schema as well, in that particular post's array of comments,
                we need to find the same comment id and delete it from there as well
                So overall, we delete Comment from comment collection and comment id from Post document's comment array.
                */

                let postId = comment.post;

                comment.remove();

                //find post by postId and pull out comments array and update the comments array by removing the id
                 let post =  Post.findByIdAndUpdate(postId , {
                    $pull: {comments: req.params.id}
                });
                req.flash('success' , 'Comment Deleted!');
                return res.redirect('back');

            } else {
                req.flash('error' , 'Comment could not be deleted!');
                return res.redirect('back');
            }
        
    } catch(err) {
        req.flash('error' , err);
        console.log(`Error in adding comment, ${err}`);
        return res.redirect('back');
    }
}