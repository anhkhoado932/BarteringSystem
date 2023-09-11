const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    products1: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    ],
    products2: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    ],
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'interrupted', 'pending', 'finished'],
    },

    rating1: Number,

    rating2: Number,

    review1: String,

    review2: String,
});

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
