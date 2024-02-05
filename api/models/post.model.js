import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        },
    title:{
        type:String,
        unique:true,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        default:'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        default:'uncategorized',
    },
},{timestamps:true});

const Post = mongoose.model('Post',PostSchema);

export default Post;