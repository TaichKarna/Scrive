const { coreModule } = require('@reduxjs/toolkit/query');
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
        default: "",
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