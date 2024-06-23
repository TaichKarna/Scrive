const { default: mongoose } = require('mongoose');

const Schema  = require('mongoose').Schema


const postModel = new Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    category: {
        type: String,
        default: 'Unauthorized'
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    }


},{timestamps: true});

module.exports = mongoose.model("Post",postModel);