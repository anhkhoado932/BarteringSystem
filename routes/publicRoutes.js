const router = require('express').Router();
const path = require('path');
const userController = require('../controller/userController');

// Register new user
router.get('/register', (_, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});
router.post('/register', userController.registerUser);
router.get('/registration-success', (req, res) => {
    res.render('registration-success');
});

// Login user
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});
router.post('/login', userController.loginUser);

// Home page
router.get(/^\/(home)?$/, (req, res) => {
    let user = req.session.user;
    res.render('home', { user: user });
});

module.exports = router;
