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
    product1: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    product2: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'interrupted', 'pending', 'finish'],
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
