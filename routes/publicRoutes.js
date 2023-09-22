const router = require('express').Router();

router.get(/^\/(home)?$/, (req, res) => {
    let user = req.session.user;
    res.render('home', { user: user });
});

module.exports = router;
