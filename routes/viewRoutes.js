const express = require('express');
const router = express.Router();
const viewController = require('../controller/viewController');
const productController = require('../controller/productController');

router.get('/info', viewController.getInfo);
router.get('/product', productController.getProducts);
router.get('/product-detail/:productId', viewController.getProductDetail);
router.get('/search', viewController.search);
router.get('/profile', viewController.getProfile);

//admin edit user and product
router.get('/edit-user/:id', viewController.editUserGet);
router.post('/edit-user/:id', viewController.editUserPost);
router.get('/edit-product/:id', viewController.editProductGet);
router.post('/edit-product/:id', viewController.editProductPost);

module.exports = router;
