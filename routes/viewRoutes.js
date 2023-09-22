const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const productController = require('../controller/productController');

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

router.get('/profile', async (req, res) => {
    let products = await Product.find({ owner: req.session.user._id });
    let message = req.session.message || null;
    req.session.message = null;

    //get the products user clicked the favorite button
    let userWithFavorites = await User.findById(req.session.user._id).populate('favorites');
    // const [products, users, feedbacks] = await Promise.all([
    //     Product.find(),
    //     User.find(),
    //     Feedback.find(),
    // ]);
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
    };
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

//admin edit user and product
router.get('/edit-user/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('edit-user', { user });
});

router.get('/edit-product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('edit-product', { product });
});

router.post('/edit-user/:id', async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    await User.findByIdAndUpdate(id, { username, email, role });
    res.redirect('/profile');
});

router.post('/edit-product/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(id, { name, price, details: description });
    res.redirect('/profile');
});

module.exports = router;
