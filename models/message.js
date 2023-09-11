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
        messageType: {
            type: String,
            default: 'text',
            enum: ['text', 'image'],
        },
        content: {
            type: String,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'message',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
