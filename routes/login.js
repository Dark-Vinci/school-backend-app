const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const wrapper = require('../middlewares/wrap');
const bodyValidator = require('../middlewares/bodyValidator');

const { validateLog, Parent } = require('../model/parentM');

router.post('/', bodyValidator(validateLog), wrapper ( async (req, res) => {
    const { phoneNumber, password } = req.body;
    const parent = await Parent.findOne({ phoneNumber: phoneNumber });

    if (!parent) {
        return res.status(400).json({
            status: 400,
            message: 'invalid phonenumber or password...'
        })
    } else {
        const isVal = await bcrypt.compare(password, parent.password);

        if (!isVal) {
            return res.status(400).json({
                status: 400,
                message: 'invalid phonenumber or password...'
            })
        } else {
            let token = parent.generateToken();

            res.header('x-auth-token', token).json({
                status: 200,
                message: 'success',
                data: parent
            })
        }
    }
}));

module.exports = router;