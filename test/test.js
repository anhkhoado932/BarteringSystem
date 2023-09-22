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
    this.timeout(50000);
    before(async function () {
        console.log("Before hook started");
        try {
            console.log("Trying to connect to DB");
            await connectDB();
            console.log("DB Connected");
        } catch (err) {
            console.error('Setup failed:', err);
            throw err;
        }
        console.log("Before hook finished");
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('User Controller', function () {
        // register test
        describe('POST /users/register', function () {
            it('should register a user', function (done) {
                chai.request(app)
                    .post('/users/register')
                    .send({ email: `test${Date.now()}@test.com`, name: 'Test', password: 'password' })
                    .end((err, res) => {
                        if (err) console.error("Error:", err.response.body);
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        expect(res.body.message).to.equal('Registration successful.');
                        done();
                    });
            });
        });

        // login test
        describe('POST /users/login', function () {
            it('should login a user', async function () {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('password', salt);
                const email = `loginTest${Date.now()}@test.com`;
                const newUser = new User({ email: email, name: 'Test', password: hashedPassword });
                await newUser.save();

                const res = await chai.request(app)
                    .post('/users/login')
                    .send({ email: newUser.email, password: 'password' });

                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').to.equal('Login successful.');
            });
        });

        // // delete test
        // describe('DELETE /users/:id', function () {
        //     it('should delete a user', async function () {
        //         const uniqueEmail = `${Date.now()}@test.com`;
        //         const newUser = new User({ email: uniqueEmail, name: 'Test', password: 'password' });
        //         const savedUser = await newUser.save();
        //         const res = await chai.request(app).delete(`/users/${savedUser._id}`);

        //         expect(res).to.have.status(200);
        //         expect(res.body).to.have.property('message').to.equal('User deleted.');
        //     });
        // });
    });

    describe('Feedback Controller', function () {
        // Post feedback test
        describe('POST /feedback', function () {
            it('should post a feedback', function (done) {
                chai.request(app)
                    .post('/feedbacks')
                    .send({
                        email: 'testemail@test.com',
                        name: 'Test User',
                        phone: '123-456-7890',
                        message: 'This is a test message.'
                    })
                    .end((err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200);
                        done();
                    });
            });
        });

        // // Delete feedback test
        // describe('DELETE /feedback/:id', function () {
        //     it('should delete a feedback', async function () {
        //         const newFeedback = new Feedback({
        //             email: 'testemail@test.com',
        //             name: 'Test User',
        //             phone: '123-456-7890',
        //             message: 'This is a test message.'
        //         });
        //         const savedFeedback = await newFeedback.save();

        //         const res = await chai.request(app).delete(`/feedbacks/${savedFeedback._id}`);
        //         expect(res).to.have.status(200);
        //         expect(res.body).to.have.property('message').to.equal('Feedback deleted successfully.');
        //     });
        // });
    });

    describe('Product Controller', function () {
        let user;
        let token;
        const filePath = '../uploads/test.jpeg';

        before(async function () {
            await User.deleteMany({ email: 'test@test.com' });
            const testUser = new User({ email: 'test@test.com', name: 'Test', password: 'password' });
            user = await testUser.save();
        });

        after(async function () {
            await User.deleteOne({ email: 'test@test.com' });
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // delete test file
            }
        });

        beforeEach(async function () {
            const res = await chai.request(app)
                .post('/users/login')
                .send({ email: 'test@test.com', password: 'password' });

            if (res.status !== 200 || !res.body.token) {
                throw new Error('Login failed');
            }
            token = res.body.token;
        });

        describe('POST /products/uploadProduct', function () {
            it('should upload a product', async function () {
                const res = await chai.request(app)
                    .post('/products/uploadProduct')
                    .set('Authorization', `Bearer ${token}`)
                    .field('productName', 'Test Product')
                    .field('productPrice', 100)
                    .field('productDetails', 'Test details')
                    .attach('productImage', fs.readFileSync(filePath), 'image.jpg');

                expect(res).to.have.status(200);
                const product = await Product.findOne({ name: 'Test Product' });
                expect(product).to.not.be.null;
                expect(product.name).to.equal('Test Product');
            });
        });

        describe('DELETE /products/:id', function () {
            it('should delete a product', async function () {
                const product = new Product({
                    name: 'Test Product',
                    imageUrl: '/uploads/test.jpeg',
                    price: 100,
                    details: 'Test details',
                    owner: user._id
                });
                const savedProduct = await product.save();
                const res = await chai.request(app).delete(`/products/${savedProduct._id}`);

                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').to.equal('Product deleted successfully!');

                const deletedProduct = await Product.findById(savedProduct._id);
                expect(deletedProduct).to.be.null;
            });
        });

        describe('GET /products', function () {
            //getProducts test
            it('should fetch all products based on price range', async function () {
                const res = await chai.request(app).get('/products?priceRange=0-100').set('Authorization', `Bearer ${token}`);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                res.body.forEach(product => {
                    expect(product.price).to.be.at.least(0);
                    expect(product.price).to.be.at.most(100);
                });
            });

            //getProductsByUser test
            it('should fetch all products by a specific user', async function () {
                const res = await chai.request(app).get('/products/byUser').set('Authorization', `Bearer ${token}`);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                res.body.forEach(product => {
                    expect(product.owner).to.equal(String(user._id));
                });
            });

            // //getAdminPage test
            // it('should fetch all user feedbacks and listings for admin', async function () {
            //     const res = await chai.request(app).get('/admin').set('Authorization', `Bearer ${token}`);
            //     expect(res).to.have.status(200);
            //     expect(res.body).to.have.property('products').that.is.an('array');
            //     expect(res.body).to.have.property('feedbacks').that.is.an('array');
            // });
        });
    });
});