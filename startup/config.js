const config = require('config');

module.exports = function () {
    if (!config.get('jwt_pass')) {
        throw new Error('FATAL ERROR: jwt_pass is not defined...')
    }
}