const express = require('express');
const router = express.Router();
const { Class } = require('../model/classShema');
const { Student, validate, validatePut } = require('../model/studentM');
const mongoose = require('mongoose');
const wrap = require('../middlewares/wrap');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const ultimateAdmin = require('../middlewares/alti');

const val = mongoose.Types.ObjectId;

router.get('/', async (req, res) => {
    const students = await Student.find({});
    res.send(students)  
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('invalid id, you might probably be lost')
    } else {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).send('invalid id, you might probably be lost')
        } else {
            res.send(student);
        }}});

router.post('/', async (req, res) => {
    // only admin memeber
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { firstName, lastName,
                age, middleName,
                level, gender,
                bestFriend, classe } = req.body;

        const friend = await Student.findById(bestFriend);

        if (bestFriend && !friend) {
            return res.status(400).send('no such friend in the db')
        }

        const classCk = await Class.findById(classe);

        if (classe && !classCk) {
            return res.status(400).send('invalid class id')
        }

        const student = new Student({
            firstName,
            lastName,
            age,
            level,
            gender,
            middleName,
            bestFriend,
        });

        if (classe && classCk) {
            student.classe =  {
                _id: classCk._id,
                name: classCk.name
            }
        }

        try {
            await student.save();
            res.send(student);
        } catch (ex) {
            let message = '';

            for (field in ex.errors) {
                message += " & " + ex.errors[field].message;
            }

            res.status(400).send(message);
        }}});

router.delete('/:id', async (req, res) => {
    // only admin member
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('you might be lost....')
    } else {
        const student = await Student.findByIdAndRemove(id);
        if (!student) {
            return res.status(400).send('no such student in db')
        } else {
            res.send(student);
        }}});

router.put('/:id', async (req, res) => {
    // admin only
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost...')
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const student = await Student.findById(id);
            let objec = Object.keys(req.body);

            if (objec.includes('classe')) {
                return res.status(400).send('not a right place to change class..')
            }

            for (let j of objec) {
                student[j] = req.body[j];
            }

            try {
                await student.save();
                res.send(student);
            } catch (ex) {
                let message = '';
    
                for (field in ex.errors) {
                    message += " & " + ex.errors[field].message;
                }
    
                res.status(400).send(message);
            }}}});

router.put('/:id/change-class', async (req, res) => {
    const { error } = validate(req.body);
    const id = req.params.id;

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        if (!val.isValid(id)) {
            return res.status(404).send('invalid student id');
        } else {
            const student = await Student.findById(id);
            if (!student) {
                return res.status(404).send('invalid student id')
            } else {
                const { classe } = req.body;
                const theClass = await Class.findById(classe);
        
                if (!theClass) {
                    return res.status(400).send('no such class in the db..');
                } else {
                    student.classe = {
                        _id: theClass._id,
                        name: theClass.name
                    }

                    res.send('success');
                }}}}})

router.get('/get-by', async (req, res) => {
    const { error } = validatePut(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const student = await Student.find(req.body);
        if (!student) {
            return res.status(400).send('no related student in the db')
        } else {
            res.send(student);
        }}});

module.exports = router;