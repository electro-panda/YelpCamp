const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedsHepers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection open");
    })
    .catch(e => {
        console.log("Error Found" + e);
    })
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}
const r = () => Math.floor((Math.random() * 500) + 1);
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        //Random1000
        let random1000 = Math.floor(Math.random() * 1000);
        const c = new Campground({
            author: "67da676e0c463f2843c0b6c1",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod non sit neque alias nulla consectetur accusamus debitis nesciunt repudiandae, autem maiores minus! Tempore saepe sint maiores hic. Necessitatibus, iusto nam!",
            price: `${r()}`,
            geometry:{
                type:"Point",
                coordinates:[
                    `${cities[random1000].longitude}`,
                    `${cities[random1000].latitude}`
                ]
            },
            images: [{
                url: 'https://res.cloudinary.com/dbrfbgob0/image/upload/v1742891231/YelpCamp/k86w1og6w7iet3fpofvp.png',
                filename: 'YelpCamp/k86w1og6w7iet3fpofvp'
            },
            {
                url: 'https://res.cloudinary.com/dbrfbgob0/image/upload/v1742551217/YelpCamp/dnxwalx5nfhlb177k1sk.png',
                filename: 'YelpCamp/dnxwalx5nfhlb177k1sk'
            }]
        });
        await c.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})