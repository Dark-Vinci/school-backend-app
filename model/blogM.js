const mongoose = require('mongoose');
const Joi = require('joi');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    writtenBy: {
        type: String,
        minlength: 5,
        maxlength: 30
    },

    body1: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },

    body2: {
        type: String,
        minlength: 10,
        maxlength: 1000
    },

    body3: {
        type: String,
        minlength: 10,
        maxlength: 1000
    },

    isPublished: {
        type: Boolean,
        default: false
    }
});

const Blog = mongoose.model('Blog', blogSchema);

function validate(inp) {
    const schema = Joi.object({
        title: Joi.string()
            .required()
            .min(3)
            .max(10),

        writtenBy: Joi.string()
            .required()
            .min(6)
            .max(100),

        body1: Joi.string()
            .required()
            .min(10)
            .max(1000),

        body2: Joi.string()
            .required()
            .min(10)
            .max(1000),

        body3: Joi.string()
            .min(10)
            .max(1000),

        isPublished: Joi.boolean()
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(10),

        writtenBy: Joi.string()
            .min(6)
            .max(100),

        body1: Joi.string()
            .min(10)
            .max(1000),

        body2: Joi.string()
            .min(10)
            .max(1000),

        body3: Joi.string()
            .min(10)
            .max(1000),

        isPublished: Joi.boolean()
    });

    const result = schema.validate(inp);
    return result;
}

module.exports.validate = validate;
module.exports.validatePut = validatePut;
module.exports.Blog = Blog;