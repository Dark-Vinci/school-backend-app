const Joi = require('joi');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength:3,
        maxlength: 20,
        required: true
    },

    body: {
        type: String,
        minlength:10,
        maxlength: 2000,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    who: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Parent'
    }
});

const Message = mongoose.model('Message', messageSchema);

function validateM(inp) {
    const schema = Joi.object({
        who: Joi.objectId()
            .required(),
        
        body: Joi.string()
            .min(10)
            .max(2000),

        title: Joi.string()
            .required()
            .min(3)
            .max(20)
    });

    const result = schema.validate(inp);
    return result;
}

module.exports = {
    Message,
    validateM,
    messageSchema
}