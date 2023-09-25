const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const Product = require('../models/product');
const User = require('../models/user');

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

    describe('View Controller', function () {
        it('Get info page', function (done) {
            agent.get('/info').end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
        });

        it('Get product by search', function (done) {
            agent.get('/search?term=test').end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
        });

        it('Get product detail page', async function () {
            const product = await Product.findOne();
            const res = await agent.get(`/product-detail/${product._id}`);
            expect(res.status).to.equal(200);
        });

        it('Get profile page', function (done) {
            agent.get('/profile').end(function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
        });

        it('Get edit user page', async function () {
            const user = await User.findOne();
            const res = await agent.get(`/edit-user/${user._id}`);
            expect(res.status).to.equal(200);
        });

        it('Edit a user', async function () {
            const user = await User.findOne();
            const res = await agent.post(`/edit-user/${user._id}`).send({
                username: 'test',
                email: 'test@email.com',
                role: 'user',
            });
            expect(res.status).to.equal(200);
        });

        it('Get edit product page', async function () {
            const product = await Product.findOne();
            const res = await agent.get(`/edit-product/${product._id}`);
            expect(res.status).to.equal(200);
        });

        it('Edit a product', async function () {
            const product = await Product.findOne();
            const res = await agent.post(`/edit-product/${product._id}`).send({
                name: 'test',
                price: '10',
                description: 'test description',
            });

            expect(res.status).to.equal(200);
        });
    });
});
