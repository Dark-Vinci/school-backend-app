const mongoose = require('mongoose');
const Joi = require('joi');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },

    classe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },

    bestStudent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },

    difficulty: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },

    completion: {
        type: Number,
        default: 1,
        min: 1,
        max: 10,
        required: true
    }
});

const Subject = mongoose.model('Subject', subjectSchema);

function validate(inp) {
    const schema = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(20),

        teacher: Joi.objectId(),

        classe: Joi.objectId(),

        bestStudent: Joi.objectId(),

        difficulty: Joi.number()
            .integer()
            .min(1)
            .max(10),

        completion: Joi.number()
            .integer()
            .min(1)
            .max(10)
    });

    const result = schema.validate(inp);
    return result;
}

function validatePut(inp)  {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(20),

        teacher: Joi.objectId(),

        classe: Joi.objectId(),

        bestStudent: Joi.objectId(),

        completion: Joi.number()
            .integer()
            .min(1)
            .max(10),
        
        difficulty: Joi.number()
            .integer()
            .min(1)
            .max(10)
    });

    const result = schema.validate(inp);
    return result;
}

module.exports.Subject = Subject;
module.exports.validate = validate;
module.exports.validatePut = validatePut;