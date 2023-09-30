const WelcomeMessage = require('../models/notification');

exports.getLatestNotification = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(400).json({ message: 'User not found in session' });
        }

        if (req.session.hasDisplayedNotification) {
            return res.json({ message: "No active notifications" });
        }

        const latestNotification = await WelcomeMessage.findOne().sort({ date: -1 });
        console.log("Latest Notification:", latestNotification);

        const welcomeMessage = await WelcomeMessage.findOne({ userId: req.session.user._id });

        if (latestNotification || welcomeMessage) {
            req.session.hasDisplayedNotification = true;
        }

        res.json({
            message: latestNotification ? latestNotification.message : null,
            welcomeMessage: welcomeMessage ? welcomeMessage.message : null
        });

        // if (welcomeMessage) await welcomeMessage.delete();
    } catch (error) {
        console.error('Error in getLatestNotification:', error);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};