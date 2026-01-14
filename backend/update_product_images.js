const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

const updates = [
    { name: 'iPhone 16 Pro', image: 'iphone16pro.png' },
    { name: 'Wireless Mouse', image: 'wireless mouse.png' },
    { name: 'Premium Cotton T-Shirt', image: 'tshirt.png' },
    { name: 'Warm Wool Sweater', image: 'sweater.png' },
    { name: 'Running Shoes', image: 'runniningshoes.png' },
    { name: 'Programming Fundamentals', image: 'programming fundamentals.jpg' },
    {
        findName: 'React Development Guide',
        newName: 'Programming React Native',
        image: 'Programming React Native.jpg'
    },
    { name: 'Modern Home Decor Set', image: 'modern home decor.jpg' },
    { name: 'Kitchen Blender', image: 'kitchn blender.jpg' },
    { name: 'Cricket Ball', image: 'sportsballforcricket.png' },
    { name: 'Yoga Mat', image: 'yogamat.jpg' },
    { name: 'Dumbbell Set', image: 'dumbellset.jpg' }
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to DB');

        for (const update of updates) {
            let filter = {};
            let updateData = { image: update.image };

            if (update.findName) {
                filter = { name: update.findName };
                updateData.name = update.newName;
                console.log(`Renaming '${update.findName}' to '${update.newName}' and updating image...`);
            } else {
                filter = { name: update.name };
                console.log(`Updating image for '${update.name}'...`);
            }

            const res = await Product.updateOne(filter, { $set: updateData });

            if (res.matchedCount === 0) {
                // Try fuzzy match if exact name not found?
                // For now just log warning
                console.warn(`⚠️  Product not found: ${update.findName || update.name}`);
            } else {
                console.log(`✅ Updated: ${update.newName || update.name}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
