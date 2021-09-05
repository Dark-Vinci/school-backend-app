const mongoose = require('mongoose');
const Joi = require('joi');

const teacherShema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },

    lastName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },

    age: {
        type: Number,
        min: 20,
        max: 70,
        required: true
    },

    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },

    yearOfEmployment: {
        type: String,
        minlength: 4,
        maxlength: 20,
        required: true
    },

    specialDuty: {
        type: String,
        default: 'none',
        enum: ['none', 'class teacher', 'lab attendant'],
        required: true
    },

    subjects: {
        type: [ new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 20
            },

            classe: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                minlength: 3,
                maxlength: 20
            }
        }) ],

        validate: {
            validator: function (v) {
                return v && v.length > 0
            },
            message: 'a teacher should have at least one subject'
        }
    }
});

const Teacher = mongoose.model('Teacher', teacherShema);

function validate(inp) {
    const schema = Joi.object({
        firstName: Joi.string()
            .required()
            .min(3)
            .max(20),
        
        lastName: Joi.string()
            .required()
            .min(3)
            .max(20),
        
        age: Joi.number()
            .integer()
            .required()
            .min(20)
            .max(70),

        gender: Joi.string()
            .min(4)
            .required()
            .max(6),

        yearOfEmployment: Joi.string()
            .min(5)
            .required()
            .max(10),

        specialDuty: Joi.string()
            .min(4)
            .max(15),
        
        subjects: Joi.array()
            .items(Joi.objectId())
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp) {
    const schema = Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(20),
        
        lastName: Joi.string()
            .min(3)
            .max(20),
        
        age: Joi.number()
            .integer()
            .min(20)
            .max(70),

        gender: Joi.string()
            .min(4)
            .max(6),

        yearOfEmployment: Joi.string()
            .min(5)
            .max(10),

        specialDuty: Joi.string()
            .min(4)
            .max(15),
        
        subjects: Joi.array()
            .items(Joi.objectId())
    });

    const result = schema.validate(inp);
    return result;
}

function validateAdd(inp) {
    const schema = Joi.object({
        subject: Joi.objectId()
            .required()
    });

    const result = schema.validate(inp);
    return result;
}

function validateBy(inp) {
    const schema = Joi.object({
        gender: Joi.string()
            .max(7)
            .min(4)
    });

    const result = schema.validate(inp);
    return result;
}

module.exports = {
    Teacher,
    validate,
    validatePut,
    validateAdd,
    validateBy
}