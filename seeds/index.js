const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Homestay = require('../models/homestay')

mongoose.connect('mongodb://localhost:27017/home-stayd', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Homestay.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random213 = Math.floor(Math.random() * 213);
        const price = Math.floor(Math.random() * 100) + 1000;
        const home = new Homestay({
            author: '6265045710f61c9791d82152',
            location: `${cities[random213].City}, ${cities[random213].State}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Amazing Place!!!',
            price,
            geometry: {
                type: "Point",
                coordinates: [88.262672, 27.036007]
            },
            images: [{
                    url: 'https://res.cloudinary.com/dj6oihbar/image/upload/v1652685012/HomeStayD/sd7zdci0umhyu5j4vwae.jpg',
                    filename: 'HomeStayD/sd7zdci0umhyu5j4vwae'
                },
                {
                    url: 'https://res.cloudinary.com/dj6oihbar/image/upload/v1652685011/HomeStayD/adkb2e3bgzwpi3y6i3t9.webp',
                    filename: 'HomeStayD/adkb2e3bgzwpi3y6i3t9'
                }
            ]
        })
        await home.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})