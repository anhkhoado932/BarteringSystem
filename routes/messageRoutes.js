const router = require('express').Router();
const messageController = require('../controller/messageController');

router.get('/:transactionId', messageController.getMessages);

module.exports = router;
