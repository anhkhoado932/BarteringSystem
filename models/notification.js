const mongoose = require('mongoose');

const welcomeMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
});

const WelcomeMessage = mongoose.model('WelcomeMessage', welcomeMessageSchema);

module.exports = WelcomeMessage;
