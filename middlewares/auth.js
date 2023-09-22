function authenticate(req, res, next) {
    console.log(req.path)
    const current_path = req.path;
    if (!req.session.user && current_path != "/login.html") {
        return res.redirect(`/login.html?redirect=${current_path}`)
    }
    next();
}

module.exports = authenticate;