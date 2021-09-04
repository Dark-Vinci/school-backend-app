const winston = require('winston');

function error(err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send('something went wrong');
}

module.exports = error;

// error
// warning
// info
// verbose
// debug
// silly
