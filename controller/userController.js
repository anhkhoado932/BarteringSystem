const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.registerUser = async (req, res) => {
    try {
        console.log("Testing query param:", req.query.testing);
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
            role: 'user',
        });

        await user.save();

        // Check if testing mode is on
        if (req.body.testing === 'true') {
            return res.status(200).json({ message: 'Registration successful.' });
        }

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
            //use session to store whether the notification has displayed or not 
            //For the first time user login, the value is always false.
            req.session.hasDisplayedNotification = false;

            // Store welcome message in the session
            req.session.welcomeMessage = `Welcome, ${user.name}!`;

            // Check if testing mode is on
            if (req.body.testing === 'true') {
                return res.status(200).json({ message: 'Login successful.' });
            }

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
    console.log("deleteUser called");
    try {
        await User.findByIdAndDelete(req.params.id);
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Internet server error' });
    }
}
