const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const Product = require('../models/product');
const User = require('../models/user');
const fs = require('fs');

chai.use(chaiHttp);

describe('Testing', function () {
    this.timeout(50000); // await DB connection
    let agent;
    before(async function () {
        agent = chai.request.agent(app);
        await agent.post('/login').send({
            email: 'admin@gmail.com',
            password: '123456',
        });
    });

    after(async function () {
        await agent.close();
    });

    describe('Product Controller', function () {
        let user;
        const filePath = './public/uploads/test.webp';

        before(async function () {
            await User.deleteMany({ email: 'test@test.com' });
            const testUser = new User({
                email: 'test@test.com',
                name: 'Test',
                password: 'password',
                favorites: [],
            });
            user = await testUser.save();
        });

        it('Upload a product', async function () {
            const res = await agent
                .post('/product/uploadProduct')
                .field('productName', 'Test Product')
                .field('productPrice', 100)
                .field('productDetails', 'Test details')
                .attach('productImage', fs.readFileSync(filePath), 'test.webp');

            expect(res).to.have.status(200);
            const product = await Product.findOne({ name: 'Test Product' });
            expect(product).to.not.be.null;
            expect(product.name).to.equal('Test Product');
        });

        it('Delete a product', async function () {
            const product = new Product({
                name: 'Test Product',
                imageUrl: '/uploads/test.webp',
                price: 100,
                details: 'Test details',
                owner: user._id,
            });
            const savedProduct = await product.save();
            const res = await agent.delete(`/product/${savedProduct._id}`);
            console.log(savedProduct._id);

            expect(res).to.have.status(200);
            console.log("Response body:", res.body);
            expect(res.body)
                .to.have.property('message')
                .to.equal('Product deleted successfully');

            const deletedProduct = await Product.findById(savedProduct._id);
            expect(deletedProduct).to.be.null;
        });

        describe('Get products', function () {

            it('Get products with filters', async function () {
                const res = await agent.get('/product?priceRange=0-100');
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                res.body.forEach((product) => {
                    expect(product.price).to.be.at.least(0);
                    expect(product.price).to.be.at.most(100);
                });
            });

            it('Get products by user', async function () {
                const res = await agent.get('/product/current-user');
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                res.body.forEach((product) => {
                    expect(product.owner).to.equal(String(user._id));
                });
            });
        });

        it('Add to favorites', async function () {
            const product = await Product.findOne({ name: 'Test Product' });
            const res = await agent.post('/product/addToFavorites').send({ productId: product._id });
            expect(res).to.have.status(200);

            const updatedUser = await User.findById(user._id);
            console.log(user.favorites);
            expect(updatedUser.favorites).to.include(String(product._id));
        });

        it('Remove from favorites', async function () {
            const product = await Product.findOne({ name: 'Test Product' });
            const res = await agent.post(`/product/removeFromFavorites/${product._id}`);
            expect(res).to.have.status(200);
            const updatedUser = await User.findById(user._id);
            expect(updatedUser.favorites).to.not.include(String(product._id));
        });
    });
});
