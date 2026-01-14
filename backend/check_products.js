const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
}).then(async () => {
  console.log('Connected to MongoDB');

  // Fetch all products
  const products = await Product.find({}, 'name image category');
  console.log('Number of products found:', products.length);

  fs.writeFileSync('products_dump.json', JSON.stringify(products, null, 2));
  console.log('Written to products_dump.json');

  mongoose.connection.close();
}).catch(err => {
  console.error('Connection error:', err);
});