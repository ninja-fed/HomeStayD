const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Homestay = require('../models/homestay');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    homestay.reviews.push(review);
    await review.save();
    await homestay.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/homestays/${homestay._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Homestay.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/homestays/${id}`);
}))

module.exports = router;