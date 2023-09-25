const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const noticationController= require('../controller/notificationController')

router.get('/latest', notificationController.getLatestNotification);

module.exports = router;