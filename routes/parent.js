const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const router = express.Router();

const { Message, validateM } = require('../model/messageM');
const { Student } = require('../model/studentM');
const { Parent, validate, validatePut, validatePass } = require('../model/parentM');

const wrapper = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const adminMiddleware = [ auth, admin ];
const authIdMiddleware = [idValidator, auth];
const idAdminMiddleware = [ idValidator, auth, admin ];
const changePasswordMiddleware = [ auth, bodyValidator(validatePass) ];
const sendMessageMiddleware = [ auth, bodyValidator(validateM) ];
const getClassParentMiddleware = [ validateBody(validateByClass), auth, admin ];
const idEditMiddleware = [ idValidator, bodyValidator(validatePut), auth, admin ];
const createMiddleware = [ bodyValidator(validate), auth, admin ];

router.get('/all-parent', adminMiddleware, wrapper ( async (req, res) => {
    const parents = await Parent.find()
        .select({ password: 0 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: parents
    })
}));

router.get('/:id',idAdminMiddleware,  wrapper ( async (req, res) => {
    const { id } = req.params;

    const parent = await Parent.findById(id);

    if (!parent) {
        return res.status(404).json({
            status: 400,
            message: 'you still might be lost'
        })
    } else {
        const toSend = _.pick(parent, ['firstName', 'lastName', 'wards', 'gender']);

        res.status(200).json({
            status: 200,
            message: 'success',
            data: toSend
        })
    }
}));

router.get('/mywards/:id', authIdMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const parent = await Parent.findById(id)
        .populate('ward');

    const wards = parent.ward
    
    res.status(200).json({
        status: 200,
        message: 'success',
        data: wards
    })
}));

router.post('/create', wrapper ( async (req, res) => {
    const { ward, password, gender, firstName, lastName, phoneNumber } = req.body;

    if (ward) {
        for (let child of ward) {
            const w = await Student.findById(child) ;

            if (!w) {
                return res.status(400).json({
                    status: 400,
                    message: 'success',
                    data: 'invalid ward inputs'
                })
            }
        }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const parent = new Parent({
        gender, firstName, lastName,
        password: hashedPass, phoneNumber, 
        ward: [...ward]
    });
        
    await parent.save();
    const toSend = _.pick(parent, ['firstName', 'lastName', 'phoneNumber', 'gender', 'ward'])

    res.status(200).json({
        status: 200,
        message: 'success',
        data: toSend
    })
}));

router.put('/edit/:id', idEditMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const parent = await Parent.findById(id)
        .select({ password: 0 });

    if (!parent) {
        return res.status(400).json({
            status: 400,
            message: 'no such person in the db'
        })
    } else {
        const { gender, firstName, lastName, phoneNumber } = req.body;

        parent.set({
            gender: gender || parent.gender,
            lastName: lastName || parent.lastName,
            firstName: firstName || parent.firstName,
            phoneNumber: phoneNumber || parent.phoneNumber
        });

        await parent.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: parent
        })
    }
}));

router.put('/remove-child', authIdMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id  
    const { studentId } = req.body;

    const parent = await Parent.findById(id);

    if (!parent) {
        return res.status(404).json({
            status: 404,
            message: 'seems very lost...'
        })
    } else {
        if (!parent.ward.includes(studentId)) {
            return res.status(400).json({
                status: 400,
                message: 'you do not have a child with the id'
            })
        } else {
            const student = parent.ward.id(studentId);
            student.remove();

            await parent.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: ` has been removed`
            })
        }
    }
}));

router.put('/add-child/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;

    const parent = await Parent.findById(id);

    if (!parent) {
        return res.status(404).json({
            status: 404,
            message: 'seems very losty...'
        })
    } else {
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(400).json({
                status: 400,
                message: 'not a child of the person'
            })
        } else {
            parent.ward.push(studentId);
            await parent.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: `${ student.firstName } has been added`
            })
        }
    }
}));

router.put('/change-password', changePasswordMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id;
    const parent = await Parent.findById(id);

    const savedPassword = parent.password;

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

        parent.password = hashPassword;
        await parent.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: `your new password is now ${ newPassword }`
        })
    }
}));

router.post('/send-message', sendMessageMiddleware, wrapper ( async (req, res) => {
    const id = req.user._id;

    const { title, body } = req.body;

    const message = new Message({
        title, body, who: id
    });

    await message.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: message
    })
}));

router.get('/get-parents-by-class/:classId', getClassParentMiddleware, wrapper ( async (req, res) => {
    const { classId } = req.params;

    let toReturn = [];

    const parents = await Parent.find()
        .populate('ward');

    for (let parent of parents) {
        parent.ward.forEach((ward) => {
            if (ward.classe._id == classId) {
                toReturn.push(parent)
            }
        })
    }

    res.status(200).json({
        status: 200,
        message: 'success',
        data: toReturn
    });
}));

module.exports = router;