const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.delete('/:id', userController.deleteUser);

module.exports = router;