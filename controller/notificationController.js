const WelcomeMessage = require('../models/notification');
const User = require('../models/user');

exports.getLatestNotification = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(400).json({ message: 'User not found in session' });
        }

        const user = await User.findById(req.session.user._id);
        if (user.hasSeenWelcomeMessage) {
            return res.json({ message: null });
        }

        const welcomeMessage = await WelcomeMessage.findOne({ userId: req.session.user._id });

        if (welcomeMessage) {
            user.hasSeenWelcomeMessage = true;
            await user.save();
        }

        res.json({
            welcomeMessage: welcomeMessage ? welcomeMessage.message : null
        });

    } catch (error) {
        console.error('Error in getLatestNotification:', error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};