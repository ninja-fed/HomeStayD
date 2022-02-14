const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Homestay = require('./models/homestay');

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


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/homestays', async(req, res) => {
    const homestays = await Homestay.find({});
    res.render('homestays/index', { homestays });
});
app.get('/homestays/new', (req, res) => {
    res.render('homestays/new');
});

app.post('/homestays', async(req, res) => {
    const homestay = new Homestay(req.body.homestay);
    await homestay.save();
    res.redirect(`/homestays/${homestay._id}`);
});

app.get('/homestays/:id', async(req, res) => {
    const homestay = await Homestay.findById(req.params.id);
    res.render('homestays/show', { homestay });
});

app.get('/homestays/:id/edit', async(req, res) => {
    const homestay = await Homestay.findById(req.params.id);
    res.render('homestays/edit', { homestay });
});

app.put('/homestays/:id', async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findByIdAndUpdate(id, {...req.body.homestay });
    res.redirect(`/homestays/${homestay._id}`);
});

app.delete('/homestays/:id', async(req, res) => {
    const { id } = req.params;
    await Homestay.findByIdAndDelete(id);
    res.redirect('/homestays');
})

app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
});