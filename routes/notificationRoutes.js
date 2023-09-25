const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

router.get('/latest', notificationController.getLatestNotification);

module.exports = router;