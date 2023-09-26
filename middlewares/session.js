/**
 * Middleware for session management with express-session 
 */
require('dotenv').config();
const session = require("express-session");

module.exports = session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
});