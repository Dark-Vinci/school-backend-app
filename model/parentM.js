const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const { postSchema } = require('../model/post');

const parentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },

    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },

    gender: {
        type: String,
        required: true,
        enum: [ 'male', 'female' ]
    },

    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },

    phoneNumber: {
        type: String ,
        required: true,
        unique: true
    },

    ward: {
        type: [ mongoose.Schema.Types.ObjectId ],
        validate: {
            validator: function(v) {
                return v && v.length >= 1
            },
            message: 'a parent should have at least a ward....'
        },
        ref: "Student"
    },

    messages: {
        type: [ postSchema ]
    }
});

parentSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, config.get('jwt_pass'));
}

const Parent = mongoose.model('Parent', parentSchema);

function validate(inp) {
    const schema = Joi.object({
        ward: Joi.array()
            .items(Joi.objectId()),

        password: Joi.string()
            .required()
            .min(5)
            .max(100),
        
        gender: Joi.string()
            .required()
            .min(4)
            .max(7),
        
        lastName: Joi.string()
            .required()
            .min(3)
            .max(30),
        
        firstName: Joi.string()
            .required()
            .min(3)
            .max(30),
        
        phoneNumber: Joi.string()
            .min(5)
            .max(20)
            .required()
    })

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    const schema = Joi.object({
        gender: Joi.string()
            .min(4)
            .max(7),
        
        lastName: Joi.string()
            .min(3)
            .max(30),
        
        firstName: Joi.string()
            .min(3)
            .max(30),
        
        phoneNumber: Joi.string()
            .min(5)
            .max(20)   
    })

    const result = schema.validate(inp)
    return result;
}

function validatePass(inp) {
    const schema = Joi.object({
        oldPassword:  Joi.string()
            .required()
            .min(4)
            .max(30),

        newPassword:  Joi.string()
            .required()
            .min(4)
            .max(30)
    })

    const result = schema.validate(inp);
    return result;
}

function validateLog(inp) {
    const schema = Joi.object({
        password: Joi.string()
            .min(5)
            .max(1000),

        phoneNumber: Joi.string()
            .min(10)
            .max(14)
    });

    const result = schema.validate(inp);
    return result;
}

function validateByClass(inp) {
    const schema = Joi.object({
        theClass: Joi.objectId()
            .required()
    })

    const result = schema.validate(inp)
    return result;
}

module.exports.Parent = Parent;
module.exports.validate = validate;
module.exports.validateLog = validateLog;
module.exports.validatePut = validatePut;
module.exports.validatePass = validatePass;
module.exports.validateByClass = validateByClass;