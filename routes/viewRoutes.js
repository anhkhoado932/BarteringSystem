const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const userController = require('../controller/userController');
const productController = require('../controller/productController');
const path = require('path');

router.get('/', (req, res) => res.redirect('/home'))
router.get('/home', (req, res) => {
    let user = req.session.user;
    res.render('home', { user: user });
});

router.get('/info', (req, res) => {
    let user = req.session.user;
    res.render('info', { user: user });
});

router.get('/product', productController.getProducts);

router.get('/product-detail/:productId', async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate('owner');
    let user = req.session.user;
    res.render('product-detail', { product: product, user: user });
});

router.get('/register-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

router.get('/registration-success', (req, res) => {
    res.render('registration-success');
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

router.post('/login', userController.loginUser);

router.get('/profile', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    let products = await Product.find({ owner: req.session.user._id });
    let message = req.session.message || null;
    req.session.message = null;

    //get the products user clicked the favorite button
    let userWithFavorites = await User.findById(req.session.user._id).populate('favorites');

    if (req.session.user.role === 'admin') {
        const users = await User.find();
        res.render('admin', {
            user: req.session.user,
            users: users,
            products: products,
            message: message
        });
    } else {
        res.render('profile', {
            user: req.session.user,
            products: products,
            message: message,
            //let profile.ejs get the favoriteProducts
            favoriteProducts: userWithFavorites.favorites
        });
    }
});

router.get('/search', async (req, res) => {
    const term = req.query.term;
    if (!term) {
        return res.redirect('/home');
    }

    try {
        let products = await Product.find({
            name: new RegExp(term, 'i')
        });

        res.render('searchResult', {
            products: products,
            user: req.session.user
        });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
