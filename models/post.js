const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const POST_PATH = path.join('/uploads/posts/pictures');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the array of id's of all comments in this post schema
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    picture:{
        type: String
    }
}, {timestamps: true});


let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '..', POST_PATH))
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now());
    }
})

postSchema.statics.uploadPost = multer({storage: storage});
postSchema.statics.postPath = POST_PATH;

const Post = mongoose.model('Post', postSchema);

module.exports = Post;