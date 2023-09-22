const Notification = require('../models/notification');

exports.getLatestNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({ isActive: true }).sort({ date: -1 });
        if (notification) {
            res.json(notification);
        } else {
            res.json({ message: "No active notifications" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};