const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./dbConnection');
const viewRoutes = require('./routes/viewRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
connectDB()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', viewRoutes);
app.use('/feedback', feedbackRoutes);

// Static files
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
