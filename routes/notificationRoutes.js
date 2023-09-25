const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController')

router.get('/latest', notificationController.getLatestNotification);

module.exports = router;