const express = require('express');
const transactionController = require('../controller/transactionController');

const router = express.Router();

router.get('/', transactionController.getTransaction);
router.post('/', transactionController.insertTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.post("/finish", transactionController.finishTransaction);
router.post("/cancel", transactionController.cancelTransaction);

module.exports = router;
