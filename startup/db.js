const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
    mongoose.connect('mongodb://localhost/school', {
        useNewUrlParser: true,
        useCreateIndex: true 
    })
    .then(() => winston.info('connected to the database...'));
}