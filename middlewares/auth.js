/**
 * Middleware for authentication 
 */
function authenticate(req, res, next) {
    // if user is unauthenticated, redirect to login page 
    if (!req.session.user && req.path != "/login") {
        return res.redirect(`/login?redirect=${req.path}`)
    }
    next();
}

module.exports = authenticate;