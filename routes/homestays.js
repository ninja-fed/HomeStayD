const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHomestay } = require('../middleware');

const Homestay = require('../models/homestay');


router.get('/', catchAsync(async(req, res) => {
    const homestays = await Homestay.find({});
    res.render('homestays/index', { homestays });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('homestays/new');
});

router.post('/', isLoggedIn, validateHomestay, catchAsync(async(req, res, next) => {
    const homestay = new Homestay(req.body.homestay);
    homestay.author = req.user._id;
    await homestay.save();
    req.flash('success', 'Successfully made a new homestay!');
    res.redirect(`/homestays/${homestay._id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(homestay);
    if (!homestay) {
        req.flash('error', 'Cannot find that homestay!');
        return res.redirect('/homestays');
    }
    res.render('homestays/show', { homestay });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findById(id);
    if (!homestay) {
        req.flash('error', 'Cannot find that homestay!');
        return res.redirect('/homestays');
    }
    res.render('homestays/edit', { homestay });
}));

router.put('/:id', isLoggedIn, isAuthor, validateHomestay, catchAsync(async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findByIdAndUpdate(id, {...req.body.homestay });
    req.flash('success', 'Successfully updated homestay!');
    res.redirect(`/homestays/${homestay._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Homestay.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted homestay!');
    res.redirect('/homestays');
}));

module.exports = router;