const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { homestaySchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Homestay = require('./models/homestay');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/home-stayd', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED");
});


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateHomestay = (req, res, next) => {
    const { error } = homestaySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/homestays', catchAsync(async(req, res) => {
    const homestays = await Homestay.find({});
    res.render('homestays/index', { homestays });
}));

app.get('/homestays/new', (req, res) => {
    res.render('homestays/new');
});

app.post('/homestays', validateHomestay, catchAsync(async(req, res, next) => {
    // if (!req.body.homestay) throw new ExpressError('Invalid Homestay Data', 400);
    const homestay = new Homestay(req.body.homestay);
    await homestay.save();
    res.redirect(`/homestays/${homestay._id}`);
}));

app.get('/homestays/:id', catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id).populate('reviews');
    res.render('homestays/show', { homestay });
}));

app.get('/homestays/:id/edit', catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id);
    res.render('homestays/edit', { homestay });
}));

app.put('/homestays/:id', validateHomestay, catchAsync(async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findByIdAndUpdate(id, {...req.body.homestay });
    res.redirect(`/homestays/${homestay._id}`);
}));

app.delete('/homestays/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Homestay.findByIdAndDelete(id);
    res.redirect('/homestays');
}));

app.post('/homestays/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const homestay = await Homestay.findById(req.params.id);
    const review = new Review(req.body.review);
    homestay.reviews.push(review);
    await review.save();
    await homestay.save();
    res.redirect(`/homestays/${homestay._id}`);
}))

app.delete('/homestays/:id/reviews/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    await Homestay.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/homestays/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
});