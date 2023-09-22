function authenticate(req, res, next) {
    const current_path = req.path;
    if (!req.session.user && current_path != "/login") {
        return res.redirect(`/login?redirect=${current_path}`)
    }
    next();
}

module.exports = authenticate;