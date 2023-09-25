const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const connectDB = require('../dbConnection');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Feedback = require('../models/feedback');
const Product = require('../models/product');
const User = require('../models/user');
const path = require('path');
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

    // TODO
    // describe('Admin page', function () {
    //     it('Admin can see product and feedback lists', async function () {
    //         const res = await agent.get('/admin');
    //         console.log(res)
    //         expect(res).to.have.status(200);
    //         expect(res.body).to.have.property('products').that.is.an('array');
    //         expect(res.body).to.have.property('feedbacks').that.is.an('array');
    //     });
    // });

    describe('User Controller', function () {
        it('Register a user', function (done) {
            agent
                .post('/register?testing=true')
                .send({
                    email: `test${Date.now()}@test.com`,
                    name: 'Test',
                    password: 'password',
                    testing: 'true',
                })
                .end((err, res) => {
                    if (err) console.error('Error:', err.response.body);
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal(
                        'Registration successful.'
                    );
                    done();
                });
        });

        it('Delete a user', async function () {
            const uniqueEmail = `${Date.now()}@test.com`;
            const newUser = new User({
                email: uniqueEmail,
                name: 'Test',
                password: 'password',
            });
            const savedUser = await newUser.save();
            const res = await agent.delete(`/user/${savedUser._id.toString()}`);
            expect(res).to.have.status(200);
            expect(res.body)
                .to.have.property('message')
                .to.equal('User deleted.');
        });

        it('Login user', async function () {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password', salt);
            const email = `loginTest${Date.now()}@test.com`;
            const newUser = new User({
                email: email,
                name: 'Test',
                password: hashedPassword,
            });
            await newUser.save();

            const res = await agent.post('/login?testing=true').send({
                email: newUser.email,
                password: 'password',
                testing: 'true',
            });
            expect(res).to.have.status(200);
            expect(res.body)
                .to.have.property('message')
                .to.equal('Login successful.');
        });
    });

    describe('Feedback Controller', function () {
        it('Post a feedback', function (done) {
            agent
                .post('/feedback')
                .send({
                    email: 'testemail@test.com',
                    name: 'Test User',
                    phone: '123-456-7890',
                    message: 'This is a test message.',
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('Delete a feedback', async function () {
            const newFeedback = new Feedback({
                email: 'testemail@test.com',
                name: 'Test User',
                phone: '123-456-7890',
                message: 'This is a test message.',
            });
            const savedFeedback = await newFeedback.save();

            const res = await agent.delete(`/feedback/${savedFeedback._id.toString()}`);
            expect(res).to.have.status(200);
            expect(res.body)
                .to.have.property('message')
                .to.equal('Feedback deleted successfully.');
        });
    });

    describe('Product Controller', function () {
        let user;
        let token;
        const filePath = './public/uploads/test.jpeg';

        before(async function () {
            await User.deleteMany({ email: 'test@test.com' });
            const testUser = new User({
                email: 'test@test.com',
                name: 'Test',
                password: 'password',
            });
            user = await testUser.save();
        });

        //     after(async function () {
        //         await User.deleteOne({ email: 'test@test.com' });
        //         if (fs.existsSync(filePath)) {
        //             fs.unlinkSync(filePath); // delete test file
        //         }
        //     });

        // TODO
        // it('Upload a product', async function () {
        //     const res = await agent
        //         .post('/product/uploadProduct')
        //         .field('productName', 'Test Product')
        //         .field('productPrice', 100)
        //         .field('productDetails', 'Test details')
        //         .attach('productImage', fs.readFileSync(filePath));

        //     expect(res).to.have.status(200);
        //     const product = await Product.findOne({ name: 'Test Product' });
        //     expect(product).to.not.be.null;
        //     expect(product.name).to.equal('Test Product');
        // });

        it('Delete a product', async function () {
            const product = new Product({
                name: 'Test Product',
                imageUrl: '/uploads/test.jpeg',
                price: 100,
                details: 'Test details',
                owner: user._id,
            });
            const savedProduct = await product.save();
            const res = await agent.delete(`/product/${savedProduct._id}`);

            expect(res).to.have.status(200);
            expect(res.body)
                .to.have.property('message')
                .to.equal('Product deleted successfully');

            const deletedProduct = await Product.findById(savedProduct._id);
            expect(deletedProduct).to.be.null;
        });

        describe('Get products', function () {
            // TODO
            // it('Get products with filters', async function () {
            //     const res = await agent.get('/product?priceRange=0-100');
            //     expect(res).to.have.status(200);
            //     expect(res.body).to.be.an('array');
            //     res.body.forEach((product) => {
            //         expect(product.price).to.be.at.least(0);
            //         expect(product.price).to.be.at.most(100);
            //     });
            // });

            it('Get products by user', async function () {
                const res = await agent.get('/product/current-user');
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                res.body.forEach((product) => {
                    expect(product.owner).to.equal(String(user._id));
                });
            });
        });

        describe('View Controller', function () {
            it('should get info', function (done) {
                chai.request(app)
                    .get('/info')
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should search products', function (done) {
                chai.request(app)
                    .get('/search?term=test')
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should get product detail', function (done) {
                const productId = ''; //khoa please put a product ID here
                chai.request(app)
                    .get(`/product-detail/${productId}`)
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should get profile', function (done) {
                chai.request(app)
                    .get('/profile')
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should edit user (GET)', function (done) {
                const userId = ''; //khoa please put a user ID here
                chai.request(app)
                    .get(`/edit-user/${userId}`)
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should edit user (POST)', function (done) {
                const userId = ''; //khoa please put a user ID here
                chai.request(app)
                    .post(`/edit-user/${userId}`)
                    .send({ username: 'test', email: 'test@email.com', role: 'user' })
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should edit product (GET)', function (done) {
                const productId = ''; //khoa please put a product ID here
                chai.request(app)
                    .get(`/edit-product/${productId}`)
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
            });
    
            it('should edit product (POST)', function (done) {
                const productId = ''; //khoa please put a product ID here
                chai.request(app)
                    .post(`/edit-product/${productId}`)
                    .send({ name: 'test', price: '10', description: 'test description' })
                    .end(function (err, res) {
                        expect(res.status).to.equal(200);
                        done();
                    });
                }
            )
        })  
    });
});
