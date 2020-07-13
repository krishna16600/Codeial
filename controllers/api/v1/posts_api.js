const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
const e = require('express');

module.exports.index = (req, res) => {
    return res.json(200 , {
        message: 'List of posts',
        posts: []
    })
}

module.exports.destroy = async (req, res) => {
    try{

        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: 'Post deleted with associated comments'
            })
        } else {
            return res.json(401 , {
                message: 'User not authorized'
            })
        }
    } catch(err) {
        console.log('***********', err);
        return res.json(500, {
            message: 'Internal Server Error'
        })
    }
}