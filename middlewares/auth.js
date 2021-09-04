const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('no token provided..')
    } else {
        try {
            const isValid = jwt.verify(token, config.get('jwt_pass'));
            req.user = isValid;
            next();
        } catch (ex) {
            return res.status(400).send('invalid token provided..')
        }}}

module.exports = auth;

// 403 => forbidden 
// 401 => youre not authenticated or wrongly authenticated