const express = require('express');
const router = express.Router();
const feedbackController = require('../controller/feedbackController');

router.post('/', feedbackController.postFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
