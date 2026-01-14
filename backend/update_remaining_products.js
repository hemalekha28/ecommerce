const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config({ path: './.env' });

const updates = [
    { name: 'Samsung Galaxy S24', image: 'Samsung S24 ultra.jpg' },
    { name: 'MacBook Air M3', image: 'macbook air m3.jpg' },
    { name: 'Denim Jeans', image: 'denim jeans.jpg' },
    { name: 'JavaScript Mastery', image: 'javascript programming.jpg' },
    { name: 'Smart Home Hub', image: 'smart home hub.jpg' }
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('Connected to DB');

        for (const update of updates) {
            const filter = { name: update.name };
            const updateData = { image: update.image };

            console.log(`Updating image for '${update.name}' to '${update.image}'...`);

            const res = await Product.updateOne(filter, { $set: updateData });

            if (res.matchedCount === 0) {
                console.warn(`⚠️  Product not found: ${update.name}`);
            } else {
                console.log(`✅ Updated: ${update.name}`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
