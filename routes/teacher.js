const express = require('express');

const router = express.Router();

const { Teacher, validate, validatePut, validateBy, validateAdd } = require('../model/teacher');
const { Subject } = require('../model/subjectM');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const wrapper = require('../middlewares/wrap');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const adminMiddleware = [ auth, admin ];
const idAdminMiddleware = [ idValidator, auth, admin ];
const createMiddleware = [ bodyValidator(validate), auth, admin ];
const getByGenderMiddleware = [ auth, admin, bodyValidator(validateBy)];
const editMiddleware = [ bodyValidator(validatePut), idValidator, auth, admin ];
const subjectAddMiddleware = [ auth, admin, bodyValidator(validateAdd), idValidator ];

router.get('/get-all', adminMiddleware, wrapper ( async (req, res) => {
    const teachers = await Teacher.find();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: teachers
    })
}));

router.post('/get-by-gender',  getByGenderMiddleware, wrapper ( async (req, res) => {
    const { gender } = req.body;
    const teacher = await Teacher.find({ gender: gender });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: teacher 
    })
}));

router.get('/get-class/:id',idValidator, wrapper ( async (req, res) => {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
        return res.status(404).json({
            status: 404,
            message: 'no such teacher in our database'
        })
    } else {
        const subjects = teacher.subjects;
        if (subjects.length <= 0) {
            res.status(400).json({
                status: 400,
                message: 'no class has been assigned to this teacher.'
            })
        }
        let toReturn = "";

        subjects.forEach((el, i) => {
            toReturn += `${ i + 1 }:  ${ el.name }: ${ el.classe } \n` 
        });

        res.status(200).json({
            status: 200,
            message: 'success',
            data: toReturn
        })
    }
}));


router.get('/one/:id', idValidator, wrapper ( async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
        return res.status(404).json({
            status: 404,
            message: 'teacher not found'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: teacher
        })
    }
}));

router.post('/create', createMiddleware, wrapper ( async (req, res) => {
    const { 
        firstName, lastName,age, gender, 
        yearOfEmployment, specialDuty, subjects,
    } = req.body;
    
    const teacher = new Teacher({
        firstName, lastName, age,
        gender, specialDuty, yearOfEmployment
    });

    if (subjects) {
        for (let i = 0; i < subjects.length; i++) {
            const sub = await Subject.findById(subjects[i]);
            if (!sub) {
                return res.status(400).json({
                    status: 400,
                    message: 'not a valid student id'
                })
            } else {
                const val = {
                    name: sub.name,
                    _id: sub._id,
                    classe: sub.classe
                }
                teacher.subjects.push(val)
            }
        }
    }

    await teacher.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: teacher 
    })
}));

router.delete('/remove/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const teacher = await Teacher.findByIdAndRemove(id);

    if (!teacher) {
        return res.status(404).json({
            status: 404,
            message: 'techer not in db'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: teacher
        })
    }
}));

router.put('/edit/:id',  editMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
        return res.status(404).json({
            status: 404,
            message: 'teacher not found'
        })
    } else {
        const { firstName, lastName, age, gender, yearOfEmployment, specialDuty } = req.body;

        teacher.set({
            firstName: firstName || teacher.firstName,
            lastName: lastName || teacher.lastName,
            age: age || teacher.age,
            gender: gender || teacher.gender,
            yearOfEmployment: yearOfEmployment || teacher.yearOfEmploy,
            specialDuty: specialDuty || teacher.specialDuty
        });

        await teacher.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: teacher 
        })
    }
}));

router.put('/add-subject/:id', subjectAddMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
        return res.status(404).json({
            status: 404,
            message: 'teacher not found'
        })
    } else {
        const { subject } = req.body;
        const theSubject = await Subject.findById(subject);

        for (let h of teacher.subjects) {
            if (h._id == subject) {
                return res.status(400).json({
                    status: 400,
                    message: 'teacher already taking the course'
                })
            }
        }

        if (!theSubject) {
            return res.status(404).json({
                status: 404,
                message: 'no such subject exist in db'
            })
        } else {

        if (!theSubject.classe) {
            return res.status(400).json({
                status: 400,
                message: 'the class for this subject hasnt been fixed'
            })
        }

        let val = {
            name: theSubject.name,
            _id: theSubject._id,
            classe: theSubject.classe
        }

        teacher.subjects.push(val);
        await teacher.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: teacher
        })
    }
}}));

module.exports = router;