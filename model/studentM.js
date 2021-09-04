const mongoose = require('mongoose');
const Joi = require('joi');

const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },

    middleName: {
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

    age: {
        type: Number,
        min: 1,
        max: 30,
        required: true
    },

    gender: {
        type: String,
        enum: [ 'male', 'female'],
        required: true
    },

    level: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },

    classe: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 10
            }
        })
        //,

        // required: true
    },

    bestFriend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }
});

const Student = mongoose.model('Student', studentSchema);

function validate(inp) {
    const schema = Joi.object({
        bestFriend: Joi.objectId(),
        
        age: Joi.number()
            .integer()
            .required()
            .min(3)
            .max(25),

        gender: Joi.string()
            .required()
            .min(4)
            .max(7),

        level: Joi.number()
            .integer()
            .min(1)
            .max(10),

        firstName: Joi.string()
            .required()
            .min(3)
            .max(30),
        
        middleName: Joi.string()
            .required()
            .min(3)
            .max(30),

        lastName: Joi.string()
            .required()
            .min(3)
            .max(30),

        classe: Joi.objectId()
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    const schema = Joi.object({
        bestFriend: Joi.objectId(),
        
        age: Joi.number()
            .integer()
            .min(3)
            .max(25),

        gender: Joi.string()
            .min(4)
            .max(7),

        level: Joi.number()
            .integer()
            .min(1)
            .max(10),

        firstName: Joi.string()
            .min(3)
            .max(30),
        
        middleName: Joi.string()
            .min(3)
            .max(30),

        lastName: Joi.string()
            .min(3)
            .max(30),

        classe: Joi.objectId()
    });

    const result = schema.validate(inp);
    return result;
}

module.exports.Student = Student;
module.exports.validate = validate;
module.exports.validatePut = validatePut;