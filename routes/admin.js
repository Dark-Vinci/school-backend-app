const express = require('express');
const router = express.Router();
const { Admin, validate, validatePut, validateLogin, validatePass } = require('../model/adminM');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const wrap = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const ultimateAdmin = require('../middlewares/alti');
const { Parent } = require('../model/parentM');
const { Message } = require('../model/messageM');
const { validatePost, Post } = require('../model/post');

const val = mongoose.Types.ObjectId;

router.get('/', [ auth, admin ], wrap( async (req, res) => {
    const admins = await Admin.find()
        .select('firstName email phoneNumber power _id');
    res.send(admins);
}));

router.get('/:id',[ auth, admin ], wrap(async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        res.status(404).send('you might be lost amn...')
    } else {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send('you still might be lost');
        } else {
            const toSend = _.pick(admin, ['firstName', 'lastName', 'gender']);
            res.send(toSend);
        }}}));

        // ,[ auth, admin, superAdmin ]

router.post('/' , wrap( async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        let { password, gender, firstName, lastName, phoneNumber, power, email } = req.body;
        
        const ad = await Admin.findOne({ email: email });
        if (ad) {
            return res.status(400).send('we have an admin with same email')
        } else {
            const salt = await bcrypt.genSalt(10);
            password  = await bcrypt.hash(password, salt);

            const admin = new Admin({
                gender,
                firstName,
                lastName,
                phoneNumber,
                power,
                email,
                password
            });

            const admins = await Admin.find();
            if (admins.length == 0) {
                admin.power = 10;
            }

            try {
                await admin.save();
                const token = admin.generateToken();
                const toSend = _.pick(admin, ['firstName', 'lastName', 'phoneNumber', 'gender', 'email'])
                res.header('x-auth-token', token).send(toSend);
            } catch (ex) {
                let message = '';

                for (field in ex.errors) {
                    message += " & " + ex.errors[field].message;
                }

                res.status(400).send(message);
            }}}}));


router.post('/:parentId/message',  wrap(async (req, res) => {
    const pId = req.params.parentId;

    if (!val.isValid(pId)) {
        return res.status(404).send('invalid parent id')
    } else {
        const parent = await Parent.findById(pId);
        if (!parent) {
            return res.status(404).send('invalid parent id')
        } else {
            const { error } = validatePost(req.body);
            if (error) {
                return res.staus(400).send(error.details[0].message);
            } else {
                const { title, body1, body2, footer } = req.body;
                const message = new Post({ 
                    title,
                    body1, 
                    body2,
                    footer
                });

                parent.messages.push(message);
                await parent.save();
                res.send('message sent...');
            }
        }
    }
}))

router.post('/login', wrap( async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            res.status(400).send('invalid email or password...');
        } else {
            const valid = await bcrypt.compare(password, admin.password);
            
            if (!valid) {
                return res.status(400).send('invalid email or password..')
            } else {
                const token = admin.generateToken();
                res.header('x-auth-token', token).send('youre welcome back ' + admin.firstName )
            }}}}));

router.put('/:id', [ auth, admin, superAdmin ], wrap( async (req, res) => {
    // only parent;
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('youre most likey on the wrong road')
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const keys = Object.keys(req.body);
            if (keys.includes('password')) {
                return res.status(400).send('this is not the right place to change password');
            } else {
                const admin = await Admin.findById(id);
                if (!admin) {
                    return res.status(400).send('no such person in the db');
                } else {
                    for (let k of keys) {
                        admin[k] = req.body[k];
                    }

                    try {
                        await admin.save();
                        res.send('successfully updated');
                    } catch (ex) {
                        let message = '';
            
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field].message;
                        }
            
                        res.status(400).send(message);
                    }}}}}}));

router.put('/:id/change-password',[ auth, admin ], wrap( async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('you are very lost man,,,,')
    } else {
        const { error } = validatePass(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message)
        } else {
            const admin = await Admin.findById(id);
            const savedPassword = admin.password;
            const { oldPassword, newPassword } = req.body;
            const isValid = await bcrypt.compare(oldPassword, savedPassword);
            
            if (!isValid) {
                return res.status(400).send('invalid inputs...')
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(newPassword, salt);
                admin.password = hashPassword;
                await admin.save();
                res.send('password successfully changed...');
            }}}}));

            
router.delete('/:id', [ auth, admin, ultimateAdmin ], wrap( async (req, res) => {
    const { id } = req.params;

    if (!val.isValid(id)) {
        return res.status(404).send('invalid admin i....')
    } else {
        const admin = await Admin.findByIdAndRemove(id);
        if (!admin) {
            return res.status(404).send('no such admin in the db...')
        } else {
            res.send(admin);
        }
    }
}));

module.exports = router;