const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.post('/uploadProduct', productController.uploadProductMiddleware, productController.uploadProduct);
router.delete('/products/:id', productController.deleteProduct);
router.get('/', productController.getItems);
router.get('/current-user', productController.getItems);

module.exports = router;
