const multer = require('multer');
const path = require('path');
const Product = require('../models/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.uploadProductMiddleware = upload.single('productImage');

exports.uploadProduct = async (req, res) => {
    try {
        if (!req.body.productName || !req.body.productPrice || !req.body.productDetails || !req.file) {
            return res.status(400).send('All fields are required');
        }

        //console.log("Received price:", req.body.productPrice); 

        const product = {
            name: req.body.productName,
            imageUrl: '/uploads/' + req.file.filename,
            price: req.body.productPrice,
            details: req.body.productDetails,
            owner: req.session.user._id
        };

        const savedProduct = await Product.create(product);
        req.session.message = "Product uploaded successfully!";

        res.redirect('/profile');
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};







exports.createItem = (req, res) => {
    const item = req.body;
    db.insert(item, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.getItems = async (req, res) => {
    let filter = {};
    if (req.query.priceRange) {
        switch (req.query.priceRange) {
            case '0-100':
                filter.price = { $gte: 0, $lte: 100 };
                break;
            case '100-300':
                filter.price = { $gte: 100, $lte: 300 };
                break;
            case '300-500':
                filter.price = { $gte: 300, $lte: 500 };
                break;
            case '500-1000':
                filter.price = { $gte: 500, $lte: 1000 };
                break;
            case 'gt1000':
                filter.price = { $gte: 1000 };
                break;
        }
    }
    let user = req.session.user;
    let items = await Product.find(filter);
    res.render('item', {
        items: items,
        user: user,
        priceRange: req.query.priceRange || 'all'
    });
};

exports.getItemsByUser = async (req, res) => {
    const { _id } = req.session.user;
    Product
        .find({ owner: _id })
        .then((products) => {
            res.status(200).send(products);
        })
}