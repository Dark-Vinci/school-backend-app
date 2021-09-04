const express = require('express');
const router = express.Router();
const { Teacher, validate, validatePut, validateBy, validateAdd } = require('../model/teacher');
const mongoose = require('mongoose');
const wrap = require('../middlewares/wrap');
const { Subject } = require('../model/subjectM');
const admin = require('../middlewares/admin');


const auth = require('../middlewares/auth');
const superAdmin = require('../middlewares/superAdmin');
const ultimateAdmin = require('../middlewares/alti');

const val = mongoose.Types.ObjectId;

router.get('/',[ auth, admin ], wrap (async (req, res) => {
    const teachers = await Teacher.find();
    res.send(teachers)
}));


router.post('/get-by-gender', [ auth, admin ], wrap( async (req, res) => {
    const { error } = validateBy(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { gender } = req.body;
        const teacher = await Teacher.find({ gender: gender });
        res.send(teacher);
    }
}));


router.get('/:id/get-class', wrap (async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('not a valid object id')
    } else {
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).send('no such teacher in our database')
        } else {
            const subjects = teacher.subjects;
            if (!subjects) {
                return res.send('no class has been assigned to this teacher.')
            }
            let toReturn = "";

            subjects.forEach((el, i) => {
                toReturn += `${ i + 1 }:  ${ el.name }: ${ el.classe } \n` 
            });

           res.send(toReturn);
        }
    }
}));


router.get('/:id', wrap (async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('sorry lost man...')
    } else {
        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).send('youre still a lost man bro........')
        } else {
            res.send(teacher)
        }}}));


router.post('/', [ auth, admin ], wrap (async (req, res) => {
    // only admin
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { firstName, lastName,
              age, gender, yearOfEmployment,
              specialDuty, subjects,
        } = req.body;
        
        const teacher = new Teacher({
            firstName,
            lastName,
            age,
            gender,
            specialDuty,
            yearOfEmployment
        });

        if (subjects) {
            for (let i = 0; i < subjects.length; i++) {
                const sub = await Subject.findById(subjects[i]);
                if (!sub) {
                    return res.status(400).send('not a valid student id')
                } else {
                    const val = {
                        name: sub.name,
                        _id: sub.id,
                        classe: sub.classe
                    }
                    teacher.subjects.push(val)
                }
            }
        }

        try {
            await teacher.save();
            res.send(teacher);
        } catch (ex) {
            let message = '';

            for (field in ex.errors) {
                message += " & " + ex.errors[field].message;
            }

            res.status(400).send(message)
}}}));


router.delete('/:id', [ auth, admin, ultimateAdmin ], wrap (async (req, res) => {
    // only admin
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('you might be lost...')
    } else {
        const teacher = await Teacher.findByIdAndRemove(id);
        if (!teacher) {
            return res.status(404).send('lost in paradise')
        } else {
            res.send(teacher);
        }}}));


router.put('/:id', [ auth, admin ], wrap (async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('youre a lost fowl..');
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const teacher = await Teacher.findById(id);
            const obj = Object.keys(req.body);

            if (!teacher) {
                return res.status(404).send('tunda faya you boss')
            }

            if (obj.includes('subjects')) {
                return res.status(400).send('not the right place to change this values')
            }

            for(let p of obj) {
                teacher[p] = req.body[p]
            }

            try {
                await teacher.save();
                res.send(teacher);
            } catch (ex) {
                let message = '';
    
                for (field in ex.errors) {
                    message += " & " + ex.errors[field].message;
                }
    
                res.status(400).send(message);
            }}}}));


router.put('/:id/add-subject', [ auth, admin, superAdmin ], wrap (async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('youre a lost fowl..');
    } else {
        const { error } = validateAdd(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const teacher = await Teacher.findById(id);

            if (!teacher) {
                return res.send(404).send('no such teacher exist in db');
            } else {
                const { subject } = req.body;
                const theSubject = await Subject.findById(subject);

                for (let h of teacher.subjects) {
                    if (h._id == subject) {
                        return res.status(400).send('teacher already taking the course')
                    }
                }

                if (!theSubject) {
                    return res.send(404).send('no such subject exist in db');
                } else {

                    if (!theSubject.classe) {
                        return res.status(400).send('the class for this subject hasnt been fixed')
                    }

                    let val = {
                        name: theSubject.name,
                        _id: theSubject._id,
                        classe: theSubject.classe
                    }

                    teacher.subjects.push(val);
                    await teacher.save();
                    res.send(teacher)
                }}}}}));

module.exports = router;