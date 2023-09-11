const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userId2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    product1: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    ],
    product2: [
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
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
