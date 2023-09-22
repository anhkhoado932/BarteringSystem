const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

router.get('/latest', async (req, res) => {
    // console.log("Session data:", req.session);
    try {
        if (req.session.hasDisplayedNotification) {
            return res.json({ message: "No active notifications" });
        }

        const latestNotification = await Notification.findOne({ active: true }).sort({ date: -1 });
        console.log("Latest Notification:", latestNotification);
        const message = latestNotification ? latestNotification.message : "No active notifications";
        console.log("Message:", message);

        if (message !== "No active notifications" || req.session.welcomeMessage) {
            req.session.hasDisplayedNotification = true;
            console.log("Set hasDisplayedNotification to true");
        }
        res.json({
            message: message,
            welcomeMessage: req.session.welcomeMessage // get the message
        });
        delete req.session.welcomeMessage; // avoid message display again and again
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;