const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const login = require('../routes/login');
const home = require('../routes/home');
const parent = require('../routes/parent');
const student = require('../routes/student');
const admin = require('../routes/admin');
const blog = require('../routes/blog');
const teacher = require('../routes/teacher');
const classe = require('../routes/class');
const subject = require('../routes/subject');
const error = require('../middlewares/error');

module.exports = function (app) {

    if (app.get('env') == 'development') {
        app.use(morgan('tiny'))
    }

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(helmet());

    app.use('/api/home', home);
    app.use('/api/login', login);
    app.use('/api/parent', parent);
    app.use('/api/student', student);
    app.use('/api/admin', admin);
    app.use('/api/blog', blog);
    app.use('/api/teacher', teacher);
    app.use('/api/class', classe);
    app.use('/api/subject', subject);

    app.use(error)
}