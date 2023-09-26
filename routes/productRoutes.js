const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const uploadMiddleware = require('../middlewares/upload');

router.post('/uploadProduct', uploadMiddleware, productController.uploadProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/current-user', productController.getProductsByUser);
router.post('/addToFavorites', productController.addToFavorites);
router.delete('/removeFromFavorites/:id', productController.removeFromFavorites);

module.exports = router;
