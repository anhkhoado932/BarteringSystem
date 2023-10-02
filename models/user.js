const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',//default to 'user'
        enum: ['user', 'admin'] //'role' can only be one of these
    },

    //save the products that user liked
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    //notification feature
    hasSeenWelcomeMessage: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;