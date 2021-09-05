const express = require('express');

const router = express.Router();

const { Class } = require('../model/classShema');
const { Teacher } = require('../model/teacher');
const { Subject, validate, validatePut } = require('../model/subjectM');
const { Student } = require('../model/studentM');

const wrapper  = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const bodyValidator = require('../middlewares/bodyValidator');
const idValidator = require('../middlewares/idValidator');

const adminMiddleware = [ auth, admin ];
const idAdminMiddleware = [ idValidator, auth, admin ];
const createMiddleware = [ bodyValidator(validate), auth, admin ];
const editMiddleware = [ idValidator, bodyValidator(validatePut), auth, admin ];

router.get('/all-subject', adminMiddleware, wrapper ( async (req, res) => {
    const subjects = await Subject.find();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: subjects
    })
}));

router.get('/one/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findById(id)
        .populate('teacher')
        .populate('bestStudent');

    if (!subject) {
        return res.status(404).json({
            status: 404,
            message: 'subject not found'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
        })
    }
}));

router.post('/create', createMiddleware,  wrapper ( async (req, res) => {
    const { name, teacher, bestStudent, difficulty, completion, classe } = req.body;
    const theTeacher = await Teacher.findById(teacher);

    if (teacher && !theTeacher) {
        return res.status(404).json({
            status: 404,
            message: 'teacher not found'
        });
    }

    const theClasse = await Class.findById(classe);

    if (classe && !theClasse) {
        return res.status(400).json({
            status: 400,
            message: 'class not found'
        });
    }

    const theBest = await Class.findById(bestStudent);

    if (bestStudent && !theBest) {
        return res.status(400).json({
            status: 400,
            message: 'invalid teacher id'
        })
    }

    const subject = new Subject({
        name, teacher,
        bestStudent, difficulty,
        completion, classe
    });

    await subject.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: subject
    })
}));

router.delete('/remove/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findByIdAndRemove(id);

    if (!subject) {
        return res.status(404).json({
            status: 404,
            message: 'subject not found'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: subject
        })
    }
}));

router.put('/edit/:id', editMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findById(id);

    const { name, bestStudent, difficulty } = req.body;

    const best = await Student.findById(bestStudent);

    if ( bestStudent && !best) {
        return res.status(400).json({
            status: 400,
            message: 'no such student in the database'
        })
    } 

    subject.set({
        bestStudent: bestStudent || subject.bestStudent,
        name: name || subject.name,
        difficulty: difficulty || subject.difficulty
    })

    await subject.save();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: subject
    })
}));

router.put('/add-teacher/:id', editMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
        return res.status(404).json({
            status: 404,
            message: 'no suxh class in the db'
        })
    } else {
        const { teacher } = req.body;
        const theTeacher = await Teacher.findById(teacher);

        if (!theTeacher) {
            return res.status(404).json({
                status: 404,
                message: 'send a valid teacher id...'
            })
        } else {
            subject.teacher = teacher;

            await subject.save();
            res.send(subject)
        }
    }
}))

router.put('/add-class/:id',  editMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findById(id);

    if (!subject) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in the db'
        })
    } else {
        const { classe } = req.body;
        const theClasse = await Class.findById(classe);

        if (!theClasse) {
            return res.status(404).json({
                status: 404,
                message: 'send a valid class id...'
            })
        } else {
            subject.classe = classe;
            await subject.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: subject
            })
        }
    }
}))

router.put('/update-completion/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const subject = await Subject.findByIdAndUpdate(id, {
        $inc: {
            completion: 1
        }
    }, { new: true });

    if (!subject) {
        return res.status(400).json({
            status: 400,
            message: 'no such subject in the db..'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: subject
        })
    }
}));

module.exports = router;