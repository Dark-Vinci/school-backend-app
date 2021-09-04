const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Class } = require('../model/classShema');
const { Teacher } = require('../model/teacher');
const { Subject, validate, validatePut } = require('../model/subjectM');
const { Student } = require('../model/studentM');
const wrap = require('../middlewares/wrap');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const ultimateAdmin = require('../middlewares/alti');

const val = mongoose.Types.ObjectId;

router.get('/', async (req, res) => {
    const subjects = await Subject.find();
    res.send(subjects)
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost man.....')
    } else {
        const subject = await Subject.findById(id)
            .populate('teacher')
            .populate('bestStudent');
        if (!subject) {
            return res.status(404).send('seems youre lost man.....')
        } else {
            res.send(subject)
        }}});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { name, teacher, bestStudent, difficulty, completion, classe } = req.body;
        const theTeacher = await Teacher.findById(teacher);

        if (teacher && !theTeacher) {
            return res.status(400).send('invalid teacher')
        }

        const theClasse = await Class.findById(classe);

        if (classe && !theClasse) {
            return res.status(400).send('invalid classe');
        }

        const theBest = await Class.findById(bestStudent);

        if (bestStudent && !theBest) {
            return res.status(400).send('invalid teacher');
        }

        const subject = new Subject({
            name,
            teacher,
            bestStudent,
            difficulty,
            completion,
            classe
        });

        try {
            await subject.save();
            res.send(subject);
        } catch (ex) {
            let message = '';

            for (field in ex.errors) {
                message += " & " + ex.errors[field].message;
            }

            res.status(400).send(message);
        }}});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost man.....')
    } else {
        const subject = await Subject.findByIdAndRemove(id);
        if (!subject) {
            return res.status(404).send('seems youre lost man.....')
        } else {
            res.send(subject)
        }}});

router.put('/:id', async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost man.....')
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const subject = await Subject.findById(id);
            let keys = Object.keys(req.body);

            if (
                keys.includes('completion') 
                || keys.includes('classe')
                || keys.includes('teacher')
            ) {
                return res.status(400).send('property cant be set here');
            }

            for (let k of keys) {
                if (k == 'bestStudent') {
                    const best = await Student.findById(req.body[k]) ;
                    if (!best) {
                        return res.status(400).send('no such student in the database');
                    } 
                }

                subject[k] = req.body[k];
            };

            try {
                await subject.save();
                res.send(subject);
            } catch (ex) {
                let message = '';
    
                for (field in ex.errors) {
                    message += " & " + ex.errors[field].message;
                }
    
                res.status(400).send(message);
            }}}});

router.put('/:id/add-teacher', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost man.....')
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const subject = await Subject.findById(id);
            if (!subject) {
                return res.status(404).send('no suxh class in the db')
            } else {
                const { teacher} = req.body;
                const theTeacher = await Teacher.findById(teacher);
                if (!theTeacher) {
                    return res.status(400).send('send a valid teacher id...')
                } else {
                    subject.teacher = teacher;

                    try {
                        await subject.save();
                        res.send(subject)
                    } catch (ex) {
                        let message = '';
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field].message
                        }

                        res.status(400).send(message)
                    }}}}}})

router.put('/:id/add-class', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost man.....')
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const subject = await Subject.findById(id);
            if (!subject) {
                return res.status(404).send('no suxh class in the db')
            } else {
                const { classe } = req.body;
                const theClasse = await Class.findById(classe);

                if (!theClasse) {
                    return res.status(400).send('send a valid teacher id...')
                } else {
                    subject.classe = classe;
                    try {
                        await subject.save();
                        res.send(subject)
                    } catch (ex) {
                        let message = '';
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field].message
                        }

                        res.status(400).send(message)
                    }}}}}})

router.put('/:id/update-completion', async (req, res) => {
    const id = req.params.id;
    if (!val.isValid(id)) {
        return res.status(404).send('seems youre lost man.....')
    } else {
        const { error } = validatePut(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const subject = await Subject.findByIdAndUpdate(id, {
                $inc: {
                    completion: 1
                }
            }, { new: true });

            if (!subject) {
                return res.status(400).send('no such subject in the db..');
            } else {
                res.send('updated')
            }}}})

module.exports = router;