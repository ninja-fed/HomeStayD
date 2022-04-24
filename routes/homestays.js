const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { homestaySchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Homestay = require('../models/homestay');


const validateHomestay = (req, res, next) => {
    const { error } = homestaySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res) => {
    const homestays = await Homestay.find({});
    res.render('homestays/index', { homestays });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('homestays/new');
});

router.post('/', isLoggedIn, validateHomestay, catchAsync(async(req, res, next) => {
    const homestay = new Homestay(req.body.homestay);
    await homestay.save();
    req.flash('success', 'Successfully made a new homestay!');
    res.redirect(`/homestays/${homestay._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id).populate('reviews');
    if (!homestay) {
        req.flash('error', 'Cannot find that homestay!');
        return res.redirect('/homestays');
    }
    res.render('homestays/show', { homestay });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id);
    if (!homestay) {
        req.flash('error', 'Cannot find that homestay!');
        return res.redirect('/homestays');
    }
    res.render('homestays/edit', { homestay });
}));

router.put('/:id', isLoggedIn, validateHomestay, catchAsync(async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findByIdAndUpdate(id, {...req.body.homestay });
    req.flash('success', 'Successfully updated homestay!');
    res.redirect(`/homestays/${homestay._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Homestay.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted homestay!');
    res.redirect('/homestays');
}));

module.exports = router;