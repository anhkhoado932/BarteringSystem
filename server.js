const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./dbConnection');
const productRoutes = require('./routes/productRoutes');
const viewRoutes = require('./routes/viewRoutes');

connectDB()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/', viewRoutes);
app.use('/products', productRoutes);
app.use('/item', productRoutes);

// Static files
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

