const express = require('express');

const router = express.Router();

const wrapper = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const superAdmin = require('../middlewares/superAdmin');
const idValidator = require('../middlewares/idValidator');
const bodyValidator = require('../middlewares/bodyValidator');

const { Blog, validate, validatePut } = require('../model/blogM');

const authMiddleware = [ auth, admin ];
const editMiddleware = [ idValidator, auth, admin ];
const deleteMiddleware = [ 
    idValidator, bodyValidator(validatePut), 
    auth, admin, superAdmin 
];

router.get('/all-blog', authMiddleware, wrapper ( async (req, res) => {
    const blogs = await Blog.find()
        .sort({ createdAt: 1 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: blogs
    });
}));

router.get('/all-published', [ auth, admin ], wrapper ( async ( req, res) => {
    const blogs = await Blog.find({ isPublished: true })
        .sort({ createdAt: 1 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: blogs
    });
}));

router.get('/all-non-published', [ auth, admin ], wrapper ( async ( req, res) => {
    const blogs = await Blog.find({ isPublished: false })
        .sort({ createdAt: 1 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: blogs
    });
}));

router.get('/get-one/:id', idValidator, wrapper ( async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(404).json({
            status: 404,
            message: 'no such blog in the db'
        });
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: blogs
        });
    }
}));

router.post('/create', bodyValidator(validate), wrapper ( async (req, res) => {
    const { title, writtenBy, body1, body2, body3, isPublished } = req.body;

    const blog = new Blog({
        title, writtenBy,
        body1, body2,
        body3, isPublished
    });

    await blog.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: blog
    });
}));

router.delete('/remove/:id', deleteMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findByIdAndRemove(id);

    if (!blog) {
        return res.status(404).json({
            status: 404,
            message: 'youre in the wilderness bro...'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: blog
        });
    }
}));

router.put('/edit/:id', editMiddleware, wrapper ( async (req, res) => {
    // admin alone
    const id = req.params.id;

    const blog = await Blog.findById(id);

    if (!blog) {
        return res.status(404).json({
            status: 404,
            message: 'youre in the dark man...'
        })
    } else {
        if (blog.isPublished) {
            return res.status(400).json({
                status: 400,
                message: 'already published, cant be modified..'
            })
        } else {
            const { title, writtenBy, body1, body2, body3, isPublished } = req.body;

            blog.set({
                title: title || blog.title,
                writtenBy: writtenBy || blog.writtenBy,
                body1: body1 || blog.body1,
                body2: body2 || blog.body2,
                body3: body3 || blog.body3,
                isPublished: isPublished || blog.isPublished
            });

            await blog.save();

            res.status(200).json({
                status: 200,
                message: 'success',
                data: blog
            })
        }
    }
}));

module.exports = router;