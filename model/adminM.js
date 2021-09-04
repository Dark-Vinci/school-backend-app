const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const adminSchema = new mongoose.Schema({
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
        enum: ['male', 'female' ]
    },

    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },

    power: {
        type: Number,
        default: 1,
        min:1,
        max: 10
    },

    email: {
        type: String,
        required: true,
        minlength:5,
        maxlength: 100,
        unique: true
    },

    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 14
    }
});

adminSchema.methods.generateToken = function () {
    return jwt.sign({ _id : this._id, power: this.power }, config.get('jwt_pass'));
}

const Admin = mongoose.model('Admin', adminSchema);

function validate(inp) {
    const schema = Joi.object({
        power: Joi.number()
            .integer()
            .min(1)
            .max(10),
        
        email: Joi.string()
            .email()
            .min(5)
            .max(20),
        
        password: Joi.string()
            .required()
            .min(5)
            .max(20),
        
        firstName: Joi.string()
            .required()
            .min(3)
            .max(30),

        lastName: Joi.string()
            .required()
            .min(3)
            .max(30),

        gender: Joi.string()
            .required()
            .min(4)
            .max(30),
        
        phoneNumber: Joi.string()
            .required()
            .min(4)
            .max(30),

        email: Joi.string()
            .email()
            .required()
            .min(4)
            .max(30)
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    const schema = Joi.object({
        power: Joi.number()
            .integer()
            .min(1)
            .max(10),
        
        email: Joi.string()
            .email()
            .min(5)
            .max(20),
        
        firstName: Joi.string()
            .min(3)
            .max(30),

        lastName: Joi.string()
            .min(3)
            .max(30),

        gender: Joi.string()
            .min(4)
            .max(30),
        
        phoneNumber: Joi.string()
            .required()
            .min(4)
            .max(30)
    });

    const result = schema.validate();
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

function validateLogin(inp) {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .required()
            .min(5)
    });

    const result = schema.validate(inp);
    return result;
}

module.exports.Admin = Admin;
module.exports.validate = validate;
module.exports.validatePut = validatePut;
module.exports.validatePass = validatePass;
module.exports.validateLogin = validateLogin;