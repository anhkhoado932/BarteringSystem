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
    product1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    product2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    status: {
        type: String,
        default: 'active',
        enum: [
            'active',
            'interrupted',
            'pending_user1',
            'pending_user2',
            'finished',
        ],
    },

    rating1: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    },

    rating2: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
    },

    review1: String,

    review2: String,
});

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
