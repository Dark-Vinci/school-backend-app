// FUNCTION THAT VALIDATES THE BODY OF A REQUEST

module.exports = function (validate) {
    return (req, res, next) => {
        const { error } = validate(req.body);

        if (error) {
            // error in the body of the request;
            return res.status(400).json({
                status: 400,
                message: error.details[0].message
            });
        } else {
            // no error, control is passed to next middleware
            next()
        }
    }
}