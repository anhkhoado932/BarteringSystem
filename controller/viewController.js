const Product = require('../models/product');
const User = require('../models/user');
const Feedback = require('../models/feedback');

exports.getInfo = (req, res) => {
    let user = req.session.user;
    res.render('info', { user: user });
};

exports.search = async (req, res) => {
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
};

exports.getProductDetail = async (req, res) => {
    const productId = req.params.productId;
    const product = await Product.findById(productId).populate('owner');
    let user = req.session.user;
    res.render('product-detail', { product: product, user: user });
};

exports.getProfile = async (req, res) => {
    let message = req.session.message || null;
    req.session.message = null;

    // For users, only get the products they own
    // For admins, get all products
    let productsQuery = (req.session.user.role === 'admin') ? Product.find() : Product.find({ owner: req.session.user._id });

    let products = await productsQuery;

    //get the products user clicked the favorite button
    let userWithFavorites = await User.findById(req.session.user._id).populate('favorites');
    if (req.session.user.role === 'admin') {
        const users = await User.find();
        const feedbacks = await Feedback.find();
        res.render('admin', {
            user: req.session.user,
            users: users,
            products: products,
            feedbacks: feedbacks,
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
};

exports.editUserGet = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('edit-user', { user });
};

exports.editUserPost = async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;
    await User.findByIdAndUpdate(id, { username, email, role });
    res.redirect('/profile');
};

exports.editProductGet = async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('edit-product', { product });
};

exports.editProductPost = async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    await Product.findByIdAndUpdate(id, { name, price, details: description });
    res.redirect('/profile');
};