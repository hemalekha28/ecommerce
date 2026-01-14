const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await mongoose.connection.db.collection('products').find({}, { projection: { name: 1, image: 1 } }).toArray();
        fs.writeFileSync('products_list.json', JSON.stringify(products, null, 2));
        console.log('Written to products_list.json');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
