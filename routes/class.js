const express = require('express');
const router = express.Router();
const { Class, validate, 
    validatePut, validateR,
    validateStudents, validateStudent,
    validateTeacher, validateSubjects,
    validateSubject
} = require('../model/classShema');
const mongoose = require('mongoose');
const { Teacher } = require('../model/teacher');
const { Student } = require('../model/studentM');
const { Subject } = require('../model/subjectM');
const wrap = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');

const val = mongoose.Types.ObjectId;

router.get('/', [ auth, admin, superAdmin ], wrap (async (req, res) => {
    const classes = await Class.find();
    res.send(classes);
}));

router.get('/:id', [ auth, admin ], wrap( async (req, res) => {
    const id = req.params.id;

    if(!val.isValid(id)) {
        return res.status(404).send('i don taya for you boss');
    } else {
        const classe = await Class.findById(id)
            .populate('subjects')
            .populate('students');
        if (!classe) {
            return res.status(404).send('no such class in the database..')
        } else {
            res.send(classe)
        }}}));

router.post('/', [ auth, admin, superAdmin ] , wrap( async (req, res) => {
    const { error } = validateR(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        const { name, specialProperty } = req.body;
        const classe = new Class({
            name,
            specialProperty
        });

        try {
            await classe.save();
            res.send(classe);
        } catch (ex) {
            let message = '';

            for (field in ex.errors) {
                message += " & " + ex.errors[field]
            }

            res.status(400).send(message)
        }}}));

router.put('/:id/add-students', [ auth, admin, superAdmin ], wrap( async (req, res) => {
    const { error } = validateStudents(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        if (!val.isValid(req.params.id)) {
            return res.status(404).send('invalid course id')
        } else {
            const classe = await Class.findById(req.params.id);
            if (!classe) {
                return res.status(404).send('no such class in db');
            } else {
                const { students } = req.body;

                try {
                    students.forEach((el) => {
                        classe.students.push(el)
                    });

                    await classe.save();
                    res.send(classe);
                } catch (ex) {
                    let message = '';

                    for (field in ex.errors) {
                        message += " & " + ex.errors[field]
                    }

                    res.status(400).send(message)
                }}}}}));

router.put('/:id/add-one-student', [ auth, admin ], wrap( async (req, res) => {
    const { error } = validateStudent(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        if (!val.isValid(req.params.id)) {
            return res.status(404).send('invalid course id')
        } else {
            const classe = await Class.findById(req.params.id);
            if (!classe) {
                return res.status(404).send('no such class in db');
            } else {
                const { student } = req.body;

                const suB = await Student.findById(student);
                if (!suB) {
                    return res.status(400).send('no such student in database');
                } else {

                    try {
                        classe.students.push(student)
                        await classe.save();
                        res.send(classe);
                    } catch (ex) {
                        let message = '';
    
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field]
                        }
    
                        res.status(400).send(message)
                    }}}}}}));



router.put('/:id/add-subjects', [ auth, admin ], wrap( async (req, res) => {
    const { error } = validateSubjects(req.body);
    
    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        if (!val.isValid(req.params.id)) {
            return res.status(404).send('invalid course id')
        } else {
            const classe = await Class.findById(req.params.id);
            if (!classe) {
                return res.status(404).send('no such class in db');
            } else {
                const { subjects } = req.body;

                try {
                    subjects.forEach((el) => {
                        classe.subjects.push(el)
                    });

                    await classe.save();
                    res.send(classe);
                } catch (ex) {
                    let message = '';

                    for (field in ex.errors) {
                        message += " & " + ex.errors[field]
                    }

                    res.status(400).send(message)
                }}}}}));


router.put('/:id/add-one-subject',[ auth, admin ], wrap( async (req, res) => {
    const { error } = validateSubject(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        if (!val.isValid(req.params.id)) {
            return res.status(404).send('invalid class id');
        } else {
            const classe = await Class.findById(req.params.id);
            if (!classe) {
                return res.status(404).send('no such class in db');
            } else {
                const { subject } = req.body;
                const suB = await Subject.findById(subject);
                if (!suB) {
                    return res.status(400).send('no such subject in database');
                } else {
                    try {
                        classe.subjects.push(subject)
                        await classe.save();
                        res.send(classe);
                    } catch (ex) {
                        let message = '';
    
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field]
                        }
    
                        res.status(400).send(message)
                    }}}}}}));

router.put('/:id/add-class-teacher', [ auth, admin, superAdmin ], wrap( async (req, res) => {
    const { error } = validateTeacher(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        const id = req.params.id;
        if (!val.isValid(id)) {
            return res.status(404).send('invalid class id...');
        } else {
            const classe = await Class.findById(id);
            if (!classe) {
                return res.status(404).send('invalid class id...');
            } else {
                const { classTeacherId } = req.body;
                const teacher = await Teacher.findById(classTeacherId);
                if (!teacher) {
                    return res.status(400).send('no such teacher in the db')
                } else {
                    classe.classTeacher = {
                        _id: teacher._id,
                        name: `${ teacher.firstName }, ${ teacher.lastName }`
                    };

                    try {
                        await classe.save();
                        res.send(classe);
                    } catch (ex) {
                        let message = '';
    
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field]
                        }
    
                        res.status(400).send(message)
                    }}}}}}));

router.put('/:id/change-class-teacher', [ auth, admin, superAdmin ], wrap( async (req, res) => {
    const { error } = validateTeacher(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        const id = req.params.id;
        if (!val.isValid(id)) {
            return res.status(404).send('invalid class id...');
        } else {
            const classe = await Class.findById(id);
            if (!classe) {
                return res.status(404).send('invalid class id...');
            } else {
                const { classTeacherId } = req.body;
                const teacher = await Teacher.findById(classTeacherId);

                if (!teacher) {
                    return res.status(400).send('no such teacher in the db')
                } else {
                    classe.classTeacher = {
                        _id: teacher._id,
                        name: `${ teacher.firstName }, ${ teacher.lastName }`
                    };

                    try {
                        await classe.save();
                        res.send(classe);
                    } catch (ex) {
                        let message = '';
    
                        for (field in ex.errors) {
                            message += " & " + ex.errors[field]
                        }
    
                        res.status(400).send(message)
                    }}}}}}));

router.put('/:id/change-property',[ auth, admin ], wrap( async (req, res) => {
    const { error } = validateRe(req.body);
    const id = req.params.id;

    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        if (!val.isValid(id)) {
            return res.status(404).send('invalid course id')
        } else {
            const classe = await Class.findById(id);
            if (!classe) {
                return res.status(404).send('no such class in the db');
            } else {
                let keys = Object.keys(req.body);

                if (keys.includes('subjects') || keys.includes('students')) {
                    return res.status(400).send('this is not the right place to add subjects or students')
                }

                for(let n of keys) {
                    classe[n] = req.body[n]
                }

                try {
                    await classe.save();
                    res.send(classe);
                } catch (ex) {
                    let message = '';

                    for (field in ex.errors) {
                        message += " & " + ex.errors[field]
                    }

                    res.status(400).send(message)
                }}}}}));

router.put('/:id/remove-student', [auth, admin ], wrap( async (req, res) => {
    const id = req.params.id;
    const studentId = req.body.student;

    if (!val.isValid(studentId)) {
        return res.status(400).send('invalid student id')
    }

    const { error } = validateStudent(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        if (!val.isValid(id)) {
            return res.status(404).send('invalid course id')
        } else {
            const classe = await Class.findById(id);
            if (!classe) {
                return res.status(404).send('no such class in the db');
            } else {
                const student = classe.students.id(studentId);
                if (!student) {
                    return res.status(404).send('student not a member of class');
                } else {
                    try {
                        student.remove();
                        await classe.save();
                        res.send(student);
                    } catch (ex) {
                        let message = '';

                        for (field in ex.errors) {
                            message += " & " + ex.errors[field]
                        }

                        res.status(400).send(message)
                    }}}}}}));

router.put('/:id/remove-subject',[ auth, admin ], wrap( async (req, res) => {
    const id = req.params.id;
    const subjectId = req.body.subject;

    if (!val.isValid(subjectId)) {
        return res.status(400).send('invalid student id')
    }

    const { error } = validateSubject(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    } else {
        if (!val.isValid(id)) {
            return res.status(404).send('invalid course id')
        } else {
            const classe = await Class.findById(id);
            if (!classe) {
                return res.status(404).send('no such class in the db');
            } else {
                const subject = classe.subjects.id(subjectId);
                if (!subject) {
                    return res.status(404).send('student not a member of class');
                } else {
                    try {
                        subject.remove();
                        await classe.save();
                        res.send(subject)
                    } catch (ex) {
                        let message = '';

                        for (field in ex.errors) {
                            message += " & " + ex.errors[field]
                        }

                        res.status(400).send(message)
                    }}}}}}));


router.delete('/:id',[ auth, admin, superAdmin ], wrap( async (req, res) => {
    const id = req.params.id;

    if (!val.isValid) {
        return res.status(404).send('you arelost man');
    } else {
        const classe = await Class.findByIdAndRemove(id);
        if (!classe) {
            return res.status(404).send('no such classs in the db');
        } else {
            res.send(classe);
        }}})); 

module.exports = router;