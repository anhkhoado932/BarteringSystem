const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const userController = require('../controller/userController');
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

    let products = await Product.find();
    let message = req.session.message || null;
    req.session.message = null;

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
            message: message
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
