const express = require('express');

const router = express.Router();

const { Class } = require('../model/classShema');
const { Student, validate, validatePut } = require('../model/studentM');

const wrapper = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const adminMiddleware = [ auth, admin ];
const idAdminMiddleware = [ idValidator, auth, admin ];
const createMiddleware = [ bodyValidator(validate), auth, admin ];
const editMiddleware = [ idValidator, bodyValidator(validatePut), auth, admin ];
const classChangeMiddleware= [ idValidator, bodyValidator(validatePut), auth, admin ];

router.get('/all-students', adminMiddleware, wrapper ( async (req, res) => {
    const students = await Student.find({}); 

    res.status(200).json({
        status: 200,
        message: 'success',
        data: students
    })
}));

router.get('/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
        return res.status(404).json({
            status: 404,
            message: 'student not found'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: student
        })
    }
}));

router.post('/create', createMiddleware, wrapper ( async (req, res) => {
    const { 
            firstName, lastName, age, middleName,
            level, gender, bestFriend, classe 
        } = req.body;

    const friend = await Student.findById(bestFriend);

    if (bestFriend && !friend) {
        return res.status(404).json({
            status: 404,
            message: 'no such friend in the db'
        })
    }

    const classCk = await Class.findById(classe);

    if (classe && !classCk) {
        return res.status(404).json({
            status: 404,
            message: 'invalid class id'
        })
    }

    const student = new Student({
        firstName, lastName, age,
        level, gender, middleName, bestFriend,
    });

    if (classe && classCk) {
        student.classe =  {
            _id: classCk._id,
            name: classCk.name
        }
    }

    await student.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: student
    });
}));

router.delete('/remove/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const student = await Student.findByIdAndRemove(id);

    if (!student) {
        return res.status(400).json({
            status: 400,
            message: 'no such student in db'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: student
        });
    }
}));

router.put('/edit/:id', editMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
        return res.status(404).json({
            status: 404,
            message: 'invalid student id'
        })
    } else {
        const { bestFriend, age, gender, level, firstName, lastName, middleName, classe } = req.body;

        student.set({
            bestFriend: bestFriend || student.bestFriend,
            age: age || student.age,
            gender: gender || student.gender,
            level: level || student.level,
            firstName: firstName || student.firstName,
            lastName: lastName || student.lastName,
            middleName: middleName || student.middleName,
            classe: classe || student.classe
        });

        await student.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: student
        })
    }
}));

router.put('/change-class/:id', classChangeMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
        return res.status(404).json({
            status: 404,
            message: 'student not found'
        })
    } else {
        const { classe } = req.body;

        const theClass = await Class.findById(classe);

        if (!theClass) {
            return res.status(404).json({
                status: 404,
                message: 'class not in the db'
            })
        } else {
            student.classe = {
                _id: theClass._id,
                name: theClass.name
            }

            res.status(200).json({
                status: 200,
                message: 'success',
                data: 'class has been changed'
            })
        }
    }
}));

module.exports = router;