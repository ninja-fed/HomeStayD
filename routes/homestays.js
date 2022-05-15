const express = require('express');
const router = express.Router();
const homestays = require('../controllers/homestays');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateHomestay } = require('../middleware');

const Homestay = require('../models/homestay');

router.route('/')
    .get(catchAsync(homestays.index))
    .post(isLoggedIn, validateHomestay, catchAsync(homestays.createHomestay));

router.get('/new', isLoggedIn, homestays.renderNewForm);

router.route('/:id')
    .get(catchAsync(homestays.showHomestay))
    .put(isLoggedIn, isAuthor, validateHomestay, catchAsync(homestays.updateHomestay))
    .delete(isLoggedIn, isAuthor, catchAsync(homestays.deleteHomestay));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(homestays.renderEditForm));

module.exports = router;