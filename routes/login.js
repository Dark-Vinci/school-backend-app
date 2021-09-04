const express = require('express');
const router = express.Router();
const { validateLog, Parent } = require('../model/parentM');
const bcrypt = require('bcrypt');
const wrap = require('../middlewares/wrap');

router.post('/', wrap (async (req, res) => {
    const { error } = validateLog(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { phoneNumber, password } = req.body;
        const parent = await Parent.findOne({ phoneNumber: phoneNumber });
        if (!parent) {
            return res.status(400).send('invalid phonenumber or password...')
        } else {
            const isVal = await bcrypt.compare(password, parent.password);
            if (!isVal) {
                return res.status(400).send('invalid username or password')
            } else {
                let token = parent.generateToken();
                res.header('x-auth-token', token).send('welcome back mama')
            }}}}));

module.exports = router;