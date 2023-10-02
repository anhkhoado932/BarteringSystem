const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const Transaction = require('../models/transaction');
const Product = require('../models/product');

chai.use(chaiHttp);

describe('Testing', function () {
    this.timeout(50000); // await DB connection
    let agent;
    let mockData = {};

    before(async function () {
        agent = chai.request.agent(app);
        await agent.post('/login').send({
            email: 'admin@gmail.com',
            password: '123456',
        });

        // Create users and products before testing
        mockData['user1'] = await new User({
            email: 'test@test.com',
            name: 'Test',
            password: 'password',
            favorites: [],
        }).save();
        mockData['user2'] = await new User({
            email: 'test@test.com',
            name: 'Test',
            password: 'password',
            favorites: [],
        }).save();
        mockData['product1'] = await new Product({
            name: 'Test Product 1',
            imageUrl: '/uploads/test.webp',
            price: 100,
            details: 'Test details',
            owner: mockData['user1']._id,
        }).save();
        mockData['product2'] = await new Product({
            name: 'Test Product 2',
            imageUrl: '/uploads/test.webp',
            price: 100,
            details: 'Test details',
            owner: mockData['user2']._id,
        }).save();
        mockData['product3'] = await new Product({
            name: 'Test Product 3',
            imageUrl: '/uploads/test.webp',
            price: 100,
            details: 'Test details',
            owner: mockData['user2']._id,
        }).save();
    });

    after(async function () {
        await agent.close();
    });

    describe('Transaction Controller', function () {
        it('Get transactions', function (done) {
            agent
                .get('/transaction')
                .send()
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res).to.be.an('array');
                    expect(res).to.not.be.empty;
                    done();
                });
        });

        it('Post a transaction', function (done) {
            agent
                .post('/transaction')
                .send({
                    productId1: mockData['product1']._id.toString(),
                    productId2: mockData['product2']._id.toString(),
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(err).to.be.null;
                    expect(res.body.message).to.equal(
                        'Transaction created successfully'
                    );
                    expect(res.body.redirect).to.not.be.empty;
                    done();

                    mockData['transaction1'] = Transaction.findById(
                        res.body.data._id
                    );
                });
        });

        it('Post an existing transaction', function (done) {
            agent
                .post('/transaction')
                .send({
                    productId1:
                        mockData['transaction1'].product1._id.toString(),
                    productId2:
                        mockData['transaction1'].product2._id.toString(),
                })
                .end((err, res) => {
                    expect(res).to.have.status(200); // No new transaction is created
                    expect(err).to.be.null;
                    expect(res.body.redirect).to.not.be.empty;
                    done();
                });
        });

        it('Update a transaction', async function () {
            agent
                .put(`/transaction/${mockData['transaction1']}`)
                .send({
                    rating1: 5,
                    review1: 'transaction went smoothly',
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res.body).to.not.be.empty;
                    done();
                });
        });

        it('Delete a transaction', async function () {
            agent
                .delete(`/transaction/${mockData['transaction1']}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res.body.deleteCount).to.equal(1);
                    done();
                });
        });
    });
});
