const express = require('express');

const router = express.Router();

const { Class, validate, 
    validatePut, validateR,
    validateStudents, validateStudent,
    validateTeacher, validateSubjects,
    validateSubject
} = require('../model/classShema');
const { Teacher } = require('../model/teacher');
const { Student } = require('../model/studentM');
const { Subject } = require('../model/subjectM');

const wrapper = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator')

const superAdminMiddleware = [ auth, admin, superAdmin ];
const idAdminMidlleware = [ idValidator, auth, admin ];
const createClassMiddleware = [ bodyValidator(validateR), auth, admin, superAdmin ];
const deleteMiddleware = [ idValidator, auth, admin, superAdmin ];
const removeSubjectMiddleware = [ idValidator, bodyValidator(validateSubject), auth, admin ];
const removeStudentMiddleware = [ idValidator, bodyValidator(validateStudent), auth, admin ];
const propertyChangeMiddleware = [ idValidator, bodyValidator(validateRe), auth, admin ];
const assignClassTeacherMiddleware = [ idValidator, bodyValidator(validateTeacher), auth, admin, superAdminMiddleware ];
const injectOneSubject = [ idValidator, bodyValidator(validateSubject), auth, admin ];
const injectSubjectsMiddleware = [ idValidator, bodyValidator(validateSubjects), auth, admin];
const injectOneStudentMiddleware = [ bodyValidator(validateStudent), idValidator, auth, admin ];
const studentsAddingMiddleware = [ idValidator, bodyValidator(validateStudents), auth, admin, superAdmin];

router.get('/all-classes', adminMiddleware, wrapper ( async (req, res) => {
    const classes = await Class.find();

    res.status(200).json({
        status: 200,
        message: 'success',
        data: classes
    })
}));

router.get('/one-class/:id', idAdminMidlleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id)
        .populate('subjects')
        .populate('students');
        
    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in the database..'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: classe
        })
    }
}));

router.post('/create', createClassMiddleware , wrapper ( async (req, res) => {
    const { name, specialProperty } = req.body;

    const classe = new Class({ name, specialProperty });

    await classe.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: classe
    })
}));

router.put('/:id/add-students', studentsAddingMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in db'
        })
    } else {
        const { students } = req.body;

        students.forEach((student) => {
            classe.students.push(student);
        });

        await classe.save();
        res.send(classe);
    }
}));

router.put('/:id/add-one-student', injectOneStudentMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in db'
        })
    } else {
        const { student } = req.body;

        const suB = await Student.findById(student);

        if (!suB) {
            return res.status(404).json({
                status: 404,
                message: 'no such student in database'
            })
        } else {
            classe.students.push(student);

            await classe.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: classe
            })
        }
    }
}));

router.put('/add-subjects/:id', injectSubjectsMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in db',
        })
    } else {
        const { subjects } = req.body;

        subjects.forEach((subject) => {
            classe.subjects.push(subject)
        });

        await classe.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: classe
        })
    }
}));

router.put('/add-one-subject/:id', injectOneSubject, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in db'
        })
    } else {
        const { subject } = req.body;
        const suB = await Subject.findById(subject);

        if (!suB) {
            return res.status(404).json({
                status: 400,
                message: 'no such subject in database'
            })
        } else {
            classe.subjects.push(subject);

            await classe.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: classe
            })
        }
    }
}));

router.put('/add-class-teacher/:id', assignClassTeacherMiddleware, wrapper ( async (req, res) => {
    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'invalid class id...'
        })
    } else {
        const { classTeacherId } = req.body;

        const teacher = await Teacher.findById(classTeacherId);

        if (!teacher) {
            return res.status(400).json({
                status: 404,
                message: 'no such teacher in the db'
            })
        } else {
            classe.classTeacher = {
                _id: teacher._id,
                name: `${ teacher.firstName }, ${ teacher.lastName }`
            };

            await classe.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: classe
            })
        }
    }
}));

router.put('/change-class-teacher/:id', assignClassTeacherMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'invalid class id...'
        })
    } else {
        const { classTeacherId } = req.body;

        const teacher = await Teacher.findById(classTeacherId);

        if (!teacher) {
            return res.status(400).json({
                status: 400,
                message: 'no such teacher in the db'
            })
        } else {
            classe.classTeacher = {
                _id: teacher._id,
                name: `${ teacher.firstName }, ${ teacher.lastName }`
            };

            await classe.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: classe
            })
        }
    }
}));

router.put('/change-property/:id', propertyChangeMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in the db'
        })
    } else {
        const { name, specialProperty } = req.body;

        classe.set({
            name: name || classe.name,
            specialProperty: specialProperty || classe.specialProperty
        });

        await classe.save();

        res.status(200).json({
            status: 200,
            message: 'success',
            data: classe
        })
    }
}));

router.put('/remove-student/:id',  removeStudentMiddleware, wrapper ( async (req, res) => {
    const id = req.params.id;
    const studentId = req.body.student;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in the db'
        })
    } else {
        const student = classe.students.id(studentId);

        if (!student) {
            return res.status(404).json({
                status: 404,
                message: 'student not a member of class'
            })
        } else {
            student.remove();

            await classe.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: classe
            })
        }
    }
}));

router.put('/remove-subject/:id/',removeSubjectMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;
    const subjectId = req.body.subject;

    const classe = await Class.findById(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such class in the db'
        })
    } else {
        const subject = classe.subjects.id(subjectId);

        if (!subject) {
            return res.status(404).json({
                status: 404,
                message: 'student not a member of class'
            })
        } else {
            subject.remove();
            await classe.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: subject
            })
        }
    }
}));

router.delete('/remove-class/:id',deleteMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const classe = await Class.findByIdAndRemove(id);

    if (!classe) {
        return res.status(404).json({
            status: 404,
            message: 'no such classs in the db'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: classe
        })
    }
})); 

module.exports = router;