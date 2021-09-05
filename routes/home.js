const express = require('express');

const router = express.Router();

const { Home, validate, validatePut } = require('../model/home');

const wrapper = require('../middlewares/wrap');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const bodyValidator = require('../middlewares/bodyValidator');
const idValidator = require('../middlewares/idValidator');

const adminMiddleware = [ auth, admin ];
const idAdminMiddleware = [ idValidator, auth, admin ];
const createMiddleware = [ bodyValidator(validate), auth, admin ];
const editMiddleware = [ idValidator, bodyValidator(validatePut), auth, admin ];

router.get('/all', adminMiddleware, wrapper ( async (req, res) => {
    const homes = await Home.find()
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 200,
        message: 'success',
        data: homes
    })
}));

router.get('/', wrapper ( async (req, res) => {
    const homes = await Home.find({ isPublished: true })
        .sort({ createdAt: -1 });

    const home = homes[0];

    if (homes.length >= 0) {
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: 'welcome home'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: home
        })
    }
}));

router.get('/one/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id } = req.params;

    const home = await Home.findById(id);

    if (!home) {
        return res.status(404).json({
            status: 404,
            message: 'oent exist man....'
        })
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: home
        })
    }
}));

router.post('/create', createMiddleware, wrapper ( async (req, res) => {
    const { header, body1, body2, body3, footer, isPublished } = req.body;

    const home = new Home({
        header, body1, body2,
        body3, footer, isPublished
    });

    await home.save();

    res.status(201).json({
        status: 201,
        message: 'success',
        data: home
    })
}));

router.delete('/remove/:id', idAdminMiddleware, wrapper ( async (req, res) => {
    const { id }= req.params;

    const home = await Home.findByIdAndRemove(id);

    if (!home) {
        return res.status(404).json({
            status: 404,
            message: 'you might be lot'
        });
    } else {
        res.status(200).json({
            status: 200,
            message: 'success',
            data: home
        });
    }
}));

router.put('/edit/:id', editMiddleware, wrapper ( async (req, res) => {
    const { id }= req.params;

    const home = await Home.findById(id);

    if (!home) {
        return res.status(404).json({
            status: 404,
            message: 'still very lost mannnn'
        })
    } else {
        if (home.isPublished) {
            return res.status(400).json({
                status: 400,
                message: 'cant be modified at this point'
            })
        } else {
            const { isPublished, footer, body1, body2, body3, header } = req.body;

            home.set({
                isPublished: isPublished || home.isPublished,
                footer: footer || home.footer,
                body1: body1 || home.body1, 
                body2: body2 || home.body2,
                body3: body3 || home.body3,
                header: header || home.header
            })

            await home.save();
            res.send(home);
        }
    }
}))

module.exports = router;