const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const router = express.Router();

const { Parent } = require('../model/parentM');
const { validatePost, Post } = require('../model/post');
const { 
    Admin, validate, validatePut, 
    validateLogin, validatePass 
} = require('../model/adminM');

const wrapper = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const ultimateAdmin = require('../middlewares/alti');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const adminMiddleware = [ auth, admin ];
const idAdminMiddleware = [ idValidator, auth, admin ];
const messageIdValidator = [idValidator, bodyValidator(validatePost) ];
const editMiddleware = [ bodyValidator(validatePut), auth, admin ];
const changePasswordMiddleware = [ bodyValidator(validatePass), auth, admin];
const deleteMiddleware = [ idValidator, auth, admin, superAdmin, ultimateAdmin ];

router.get('/all-admin', adminMiddleware, wrapper ( async (req, res) => {
    const admins = await Admin.find()
        .select({ password: 0 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: admins
    });
}));

router.get('/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const id = req.params.id;

    const admin = await Admin.findById(id);

    if (!admin) {
        return res.status(404).json({
            status: 404,
            message: 'theres no such admin with the id in the db'
        });
    } else {
        const toSend = _.pick(admin, ['firstName', 'lastName', 'gender']);
        
        res.status(200).json({
            status: 200,
            message: 'success',
            data: toSend
        });
    }
}));

router.post('/create' , bodyValidator(validate), wrapper ( async (req, res) => {
    let { password, gender, firstName, lastName, phoneNumber, power, email } = req.body;
    
    const ad = await Admin.findOne({ email: email });

    if (ad) {
        return res.status(400).json({
            status: 400,
            message: 'we have an admin with same email'
        });
    } else {
        const salt = await bcrypt.genSalt(10);
        password  = await bcrypt.hash(password, salt);

        const admin = new Admin({
            gender, firstName, lastName,
            phoneNumber, power, email, password
        });

        const admins = await Admin.find();
        if (admins.length == 0) {
            admin.power = 10;
        }

        await admin.save();

        const token = admin.generateToken();
        const toSend = _.pick(admin, ['firstName', 'lastName', 'phoneNumber', 'gender', 'email'])
        
        res.status(201).header('x-auth-token', token).json({
            status: 201,
            message: 'success',
            data: toSend
        });
    }
}));

router.post('/message/:parentId/',  messageIdValidator, wrapper ( async (req, res) => {
    const pId = req.params.parentId;

    const parent = await Parent.findById(pId);
    if (!parent) {
        return res.status(404).json({
            status: 404,
            message: 'invalid parent id'
        })
    } else {
        const { title, body1, body2, footer } = req.body;

        const message = new Post({ 
            title, body1, 
            body2, footer
        });

        parent.messages.push(message);
        await parent.save();
        
        res.status(201).json({
            status: 201,
            message: 'success',
            data: 'message sent...'
        })
    }
}))

router.post('/login',  bodyValidator(validateLogin), wrapper ( async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
        res.status(400).json({
            status: 400,
            message: 'invalid email or password...'
        })
    } else {
        const valid = await bcrypt.compare(password, admin.password);
        
        if (!valid) {
            return res.status(400).json({
                status: 400,
                message: 'invalid email or password..'
            })
        } else {
            const token = admin.generateToken();

            res.header('x-auth-token', token).json({
                status: 200,
                message: 'success',
                data: 'youre welcome back ' + admin.firstName
            })
        }
    }
}));

router.put('/edit', editMiddleware, wrapper ( async (req, res) => {
    // only parent;
    const id = req.user._id;

    const { power, firstName, lastName, phoneNumber } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
        return res.status(400).json({
            status: 400,
            message: 'no such person in the db'
        });
    } else {
        admin.set({
            power: power || admin.power,
            firstName: firstName || admin.firstName,
            lastName: lastName || admin.lastName,
            phoneNumber: phoneNumber || admin.phoneNumber
        });

        await admin.save();
        
        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'successfully updated'
        })
    }
}));

router.put('/change-password', changePasswordMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id;

    const admin = await Admin.findById(id);
    const savedPassword = admin.password;

    const { oldPassword, newPassword } = req.body;

    const isValid = await bcrypt.compare(oldPassword, savedPassword);
    
    if (!isValid) {
        return res.status(400).json({
            status: 400,
            message: 'invalid inputs...'
        })
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        admin.password = hashPassword;
        await admin.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: 'password successfully changed...'
        })
    }
}));

router.delete('/remove/:id', deleteMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndRemove(id);

    if (!admin) {
        return res.status(404).json({
            status: 404,
            message: 'no such admin in the db...'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: admin
        })
    }
}));

module.exports = router;