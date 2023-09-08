const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./dbConnection');
const viewRoutes = require('./routes/viewRoutes');
const userRoutes = require('./routes/userRoutes');

connectDB()

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', viewRoutes);
app.use('/users', userRoutes);

// Static files
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
