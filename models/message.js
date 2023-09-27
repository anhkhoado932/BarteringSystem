const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'transaction',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

messageSchema.index({ transactionId: 1, createdAt: -1 });

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
