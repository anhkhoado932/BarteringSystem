const Product = require('../models/product');
const User = require('../models/user');


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
        console.log("deleteProduct called");
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getProducts = async (req, res) => {
    try {
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

        filter['owner'] = { $ne: req.session.user._id };
        let user = req.session.user;
        let products = await Product.find(filter).populate('owner');
        res.render('product', {
            products: products,
            user: user,
            priceRange: req.query.priceRange || 'all'
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getProductsByUser = async (req, res) => {
    const { _id } = req.session.user;
    Product
        .find({ owner: _id })
        .then((products) => {
            res.status(200).render(products);
        })
}

exports.addToFavorites = async (req, res) => {
    const productId = req.body.productId;
    const userId = req.session.user._id;
    console.log('addToFavorites called:', productId, userId);
    try {
        const user = await User.findById(userId);
        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            await user.save();
            const updatedUser = await User.findById(userId);
            console.log(updatedUser.favorites);
        }
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

exports.removeFromFavorites = async (req, res) => {
    console.log("Received request to delete product from favorites with ID:", req.params.id);
    const userId = req.session.user._id;
    const productId = req.params.id;

    try {
        const result = await User.updateOne(
            { _id: userId },
            { $pull: { favorites: productId } }
        );
        if (result.nModified === 0) {
            console.log("No documents were updated. Product was not in favorites?");
        } else {
            console.log("Product successfully removed from favorites.");
        }

        res.json({ success: true, message: 'Product removed from favorites.' });

    } catch (error) {
        console.error("Error during removeFromFavorites:", error);
        res.json({ success: false, message: error.message });
    }
};
