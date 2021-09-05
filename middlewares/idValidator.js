// FUNCTION TO VALIDATE THE OBJECT ID IN THE URL OF A REQUEST

const mongoose = require('mongoose');

module.exports = function (req, res, next) { 
    const id = req.params.id;
    const valid = mongoose.Types.ObjectId;

    if (!valid.isValid(id)) {
        // not a valid mongoose object id
        return res.status(404).json({
            status: 404,
            message: 'invalid object id'
        });
    } else {
        // object id is valid, control is passed to next middleware
        next();
    }
}