const bcrypt = require('bcryptjs');
const User = require('../models/user');
const WelcomeMessage = require('../models/notification');

exports.registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // check email, name and password are exsited or not
        //if email, name or password was missing, it will appears 400 error (400 Bad Request is a standardized way to communicate to the client).
        if (!email || !name || !password) {
            return res.status(400).send('Missing email, name or password.');
        }

        // check password, check if password is a string
        if (typeof password !== 'string') {
            return res.status(400).send('Invalid password provided.');
        }

        // check email---query a database( MongoDB )
        //giving a descriptive name to a variable like 'existingUser'
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // hashing the password
        // 'random "salt" value using the 'bcrypt'-protect password security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //defind when someone register, which is defind as user role; and including email, name and password
        const user = new User({
            email,
            name,
            password: hashedPassword,
            role: 'user',
        });

        await user.save();

        // Check if testing mode is on
        if (req.body.testing === 'true') {
            return res
                .status(200)
                .json({ message: 'Registration successful.' });
        }

        res.redirect('/registration-success');
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    try {
        // find the user in the database with provided email;
        const user = await User.findOne({ email: req.body.email });

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            // Reset the hasSeenWelcomeMessage flag
            user.hasSeenWelcomeMessage = false;
            await user.save();

            req.session.user = user;

            // Create welcome message
            const welcomeMessageText = `Welcome, ${user.name}!`;

            let welcomeMessage = await WelcomeMessage.findOne({ userId: user._id });
            if (!welcomeMessage) {
                welcomeMessage = new WelcomeMessage({ userId: user._id, message: welcomeMessageText });
            } else {
                welcomeMessage.message = welcomeMessageText;
            }
            console.log('Welcome Message:', welcomeMessage);
            await welcomeMessage.save();

            // Check if testing mode is on
            if (req.body.testing === 'true') {
                return res.status(200).json({ message: 'Login successful.' });
            }

            // Redirect to original route if exist, else redirect home
            const redirect = req.query.redirect ?? '/home';
            res.status(200).send({ redirect });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id); //find a user by their ID and delete them from database
        res.status(200).json({ messgae: 'User deleted' }); //successful-200
    } catch (error) {
        res.status(500).json({ message: 'Internet server error' });
    }
};
