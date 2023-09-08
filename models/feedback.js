const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
}, {
    timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;