const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

router.post('/uploadProduct', productController.uploadProductMiddleware, productController.uploadProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getProducts);
router.get('/current-user', productController.getItemsByUser);


module.exports = router;
