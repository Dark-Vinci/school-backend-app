const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { Message, validateM } = require('../model/messageM');
const { Student } = require('../model/studentM');
const { Parent, validate, validatePut, validatePass } = require('../model/parentM')
const wrap = require('../middlewares/wrap');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const ultimateAdmin = require('../middlewares/alti');

const val = mongoose.Types.ObjectId;

router.get('/', async (req, res) => {
    // just admin
    const parents = await Parent.find().select('-password');
    res.send(parents);
});

router.get('/:id', async (req, res) => {
    // admin or parent
    const id = req.params.id;

    if (!val.isValid(id)) {
        res.status(404).send('you might be lost amn...')
    } else {
        const parent = await Parent.findById(id);
        if (!parent) {
            return res.status(404).send('you still might be lost');
        } else {
            const toSend = _.pick(parent, ['firstName', 'lastName', 'wards', 'gender']);
            res.send(toSend);
        }}});

router.get('/:id/myward', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('you dey ment abi...')
    } else {
        const parent = await Parent.findById(id)
            .populate('ward');
        const wards = parent.ward
        res.send(wards);
    }})

router.post('/', async (req, res) => {
    // just admin
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        const { ward, password, gender, firstName, lastName, phoneNumber } = req.body;
        if (ward) {
            for (let j of ward) {
                const w = await Student.findById(j) ;
                if (!w) {
                    return res.status(400).send('invalid ward inputs');
                }
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        const parent = new Parent({
            gender,
            firstName,
            lastName,
            password: hashedPass,
            phoneNumber
        });
        
        ward.forEach((el) => {
            parent.ward.push(el)
        });

        try {
            await parent.save();
            const toSend = _.pick(parent, ['firstName', 'lastName', 'phoneNumber', 'gender', 'ward'])
            res.send(toSend);
        } catch (ex) {
            let message = '';
            
            for (field in ex.errors) {
                message += " & " + ex.errors[field].message;
            }

            res.status(400).send(message);
        }}})

router.put('/:id', async (req, res) => {
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

            if (keys.includes('password')  || keys.includes('ward')) {
                return res.status(400).send('this is not the right place to change password');
            } else {
                const parent = await Parent.findById(id);
                if (!parent) {
                    return res.status(400).send('no such person in the db');
                } else {
                    for (let k of keys) {
                        parent[k] = req.body[k];
                    }

                    try {
                        await parent.save();
                        res.send('successfully updated');
                    } catch (ex) {
                        let message = 'rkj';
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field].message;
                        }
            
                        res.status(400).send(message);
                    }}}}}});

router.put('/:id/remove-child', async (req, res) => {
    const { id } = req.params;   
    const { studentId } = req.body;

    if (!val.isValid(id) || !val.isValid(studentId)) {
        return res.status(404).send('you seems lost....')
    } else {
        const parent = await Parent.findById(id);
        if (!parent) {
            return res.status(404).send('seems very lost...')
        } else {
            if (!parent.ward.includes(studentId)) {
                return res.status(400).send('invalid studentId')
            } else {
                const student = parent.ward.id(studentId);
                student.remove();
                await parent.save();
                res.send(`${ stu.firstName } has been removed`)
            }}}});
            
router.put('/:id/add-child', async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;

    if (!val.isValid(id) || !val.isValid(studentId)) {
        return res.status(404).send('mmm seems lost....')
    } else {
        const parent = await Parent.findById(id);
        if (!parent) {
            return res.status(404).send('seems very losty...')
        } else {
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(400).send('not a child of the person')
            } else {
                parent.ward.push(studentId);
                await parent.save();
                res.send(`${ student.firstName } has been added`);
            }}}})

router.put('/:id/change-password', async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('you are very lost man,,,,')
    } else {
        const { error } = validatePass(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message)
        } else {
            const parent = await Parent.findById(id);
            const savedPassword = parent.password;
            const { oldPassword, newPassword } = req.body;
            const isValid = await bcrypt.compare(oldPassword, savedPassword);
            if (!isValid) {
                return res.status(400).send('invalid inputs...')
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(newPassword, salt);
                parent.password = hashPassword;
                await parent.save();
                res.send('password successfully changed');
            }}}});

router.post('/:id/send-message', async (req, res) => {
    const id = req.params.id;

    if (!val.isValid) {
        return res.status(404).send('youre def lost man....')
    } else {
        const { error } = validateM(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const { title, body } = req.body;
            const message = new Message({
                title, 
                body,
                who: id
            });

            try {
                await message.save();
                res.send(message);
            } catch (ex) {
                let message = '';
    
                for (field in ex.errors) {
                    message += " & " + ex.errors[field].message;
                }
    
                res.status(400).send(message);
            }}}});

router.get('/get-parents-by-class', async (req, res) => {
    const { error } = validateByClass(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        let toReturn = [];
        const parents = await Parent.find()
            .populate('ward');

        for (let p of parents) {
            p.ward.forEach((el) => {
                if (el.classe._id == req.body.classId) {
                    toReturn.push(p)
                }
            })
        }

        res.send(toReturn);
    }});

module.exports = router;