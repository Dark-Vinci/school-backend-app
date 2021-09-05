const mongoose = require('mongoose');
const Joi = require('joi');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxength: 30
    },

    body1: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 1000
    },

    body2: {
        type: String,
        minlength: 20,
        maxlength: 1000
    },

    footer: {
        type: String,
        minlength: 5,
        maxlength: 100
    }
});

const Post = mongoose.model('Post', postSchema);

function validatePost(inp) {
    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(5)
            .max(30),

        body1: Joi.string()
            .required()
            .min(20)
            .max(1000),

        body2: Joi.string()
            .min(20)
            .max(1000),

        footer: Joi.string()
            .min(5)
            .max(30)
    });

    const result = schema.validate(inp);
    return result;
}

module.exports = {
    Post,
    postSchema,
    validatePost
}