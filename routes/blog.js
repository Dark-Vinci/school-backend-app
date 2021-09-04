const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Blog, validate, validatePut } = require('../model/blogM');
const wrap = require('../middlewares/wrap');

const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');

const val = mongoose.Types.ObjectId;

router.get('/all-blog',[ auth, admin ], wrap( async (req, res) => {
    const blogs = await Blog.find();
    res.send(blogs);
}));

router.get('/', wrap (async ( req, res) => {
    const blogs = await Blog.find({ isPublished: true });
    res.send(blogs)
}));

router.get('/all-not-published',[ auth, admin ], wrap( async ( req, res) => {
    const blogs = await Blog.find({ isPublished: false });
    res.send(blogs)
}));

router.get('/:id', wrap( async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('this is the lost room...')
    } else {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).send('werey dey disguise');
        } else {
            res.send(blog)
        }}}));

router.post('/', wrap( async (req, res) => {
    // only admin
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const { title, writtenBy, body1, body2, body3, isPublished } = req.body;
        const blog = new Blog({
            title,
            writtenBy,
            body1,
            body2,
            body3,
            isPublished
        });

        try {
            await blog.save();
            res.send(blog);
        } catch(ex) {
            let message = '';

            for (field in ex.errors) {
                message += ' & ' + ex.errors[field];
            }

            res.status(400).send(message);
        }}}));

router.delete('/:id',[ auth, admin, superAdmin ], wrap( async (req, res) => {
    const id = req.params.id;

    if (!val.isValid(id)) {
        return res.status(404).send('youre def lost bobo')
    } else {
        const blog = await Blog.findByIdAndRemove(id);
        if (!blog) {
            return res.status(404).send('youre in the wilderness bro...')
        } else {
            res.send(blog)
        }}}));

router.put('/:id', [ auth, admin ], wrap (async (req, res) => {
    // admin alone
    const id = req.params.id;

    const { error } = validatePut(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).send('youre in the dark man...')
        } else {
            if (blog.isPublished) {
                return res.status(400).send('already published, cant be modified..')
            } else {
                const keys = Object.keys(req.body);

                for (let j of keys) {
                    blog[j] = req.body[j];
                }
    
                try {
                    await blog.save();
                    res.send(blog);
                } catch(ex) {
                    let message = ''
                    for (field in ex.errors) {
                        message += ' & ' + ex.errors[field];
                    }
    
                    res.status(400).send(message)
                }}}}}));

module.exports = router;