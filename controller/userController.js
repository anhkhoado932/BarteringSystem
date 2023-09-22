const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.registerUser = async (req, res) => {
    try {
        console.log(req.body);

        const { email, name, password } = req.body;

        // check email, name and password are exsited or not
        if (!email || !name || !password) {
            return res.status(400).send('Missing email, name or password.');
        }

        // check password
        if (typeof password !== 'string') {
            return res.status(400).send('Invalid password provided.');
        }

        // check email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            email,
            name,
            password: hashedPassword,
            role:'user',
        });

        await user.save();

        res.redirect('/registration-success');
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    try {
        // find the user
        const user = await User.findOne({ email: req.body.email });

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user;
            
            // Redirect to original route if exist, else redirect home
            const redirect = req.query.redirect ?? '/home';
            res.status(200).send({ redirect });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.stutus(200).json({messgae: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Internet server error' });
    }
}
