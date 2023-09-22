const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

router.get('/latest', async (req, res) => {
    try {
        const latestNotification = await Notification.findOne({ active: true }).sort({ date: -1 });
        const message = latestNotification ? latestNotification.message : "No active notifications";
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