const mongoose = require('mongoose');
const Joi = require('joi');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 10
    },

    students: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Student'
    },

    subjects: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Subject'
    },

    classTeacher: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 10
            }
        })
    },

    specialProperty: {
        type: String,
        minlength: 5,
        maxlength: 20,
        default: 'none'
    }
});

const Class = mongoose.model('Class', classSchema);

function validate(inp) {
    const schema = Joi.object({
        specialProperty: Joi.string()
            .min(10)
            .max(1000),
        
        name: Joi.string()
            .min(2)
            .max(20)
            .required(),

        subjects: Joi.array()
            .items(Joi.objectId()),

        students: Joi.array()
            .items(Joi.objectId())
    });

    const result = schema.validate(inp);
    return result;
}



function validateR(inp) {
    const schema = Joi.object({
        specialProperty: Joi.string()
            .min(10)
            .max(1000),
        
        name: Joi.string()
            .min(2)
            .max(20)
            .required()
    });

    const result = schema.validate(inp);
    return result;
}

function validateRe(inp) {
    const schema = Joi.object({
        specialProperty: Joi.string()
            .min(10)
            .max(1000),
        
        name: Joi.string()
            .min(2)
            .max(20)
    });

    const result = schema.validate(inp);
    return result;
}

function validateStudents(inp) {
    const schema = Joi.object({
        students: Joi.array()
            .Joi.objectId()
    });

    const result = schema.validate(inp);
    return result;
}

function validateStudent(inp) {
    const schema = Joi.object({
        student: Joi.objectId()
    });

    const result = schema.validate(inp);
    return result;
}

function validateSubject(inp) {
    const schema = Joi.object({
        subject: Joi.objectId()
    });

    const result = schema.validate(inp);
    return result;
}

function validateSubjects(inp) {
    const schema = Joi.object({
        subjects: Joi.array()
            .Joi.objectId()
    });

    const result = schema.validate(inp);
    return result;
}

function validateTeacher(inp) {
    const schema = Joi.object({
        classTeacherId: Joi.objectId()
            .required()
    });

    const result = schema.validate(inp);
    return result;
}


function validatePut(inp) {
    const schema = Joi.object({
        specialProperty: Joi.string()
            .min(10)
            .max(1000),
        
        name: Joi.string()
            .min(2)
            .max(20),

        subjects: Joi.array()
            .items(Joi.objectId()),

        students: Joi.array()
            .items(Joi.objectId())
    });

    const result = schema.validate(inp);
    return result;
}

module.exports = {
    Class,
    validate,
    validatePut, 
    validateR,
    validateStudents, 
    validateStudent,
    validateTeacher, 
    validateRe,
    validateSubject,
    validateSubjects
}