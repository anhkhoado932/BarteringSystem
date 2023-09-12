const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    price: Number,
    details: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
