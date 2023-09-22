const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['holiday', 'alert', 'info'],
        default: 'info'
    },
    active: {
        type: Boolean,
        default: true
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;