const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const Transaction = require('../models/transaction');
const User = require('../models/user'); 
const Product = require('../models/product'); 

chai.use(chaiHttp);

describe('Testing', function () {
    this.timeout(50000); // await DB connection
    let agent;
    let mockData = {};

    beforeEach(async function () {
        // Create users and products before testing
        mockData['user1'] = await new User({
            email: 'test1@test.com',
            name: 'Test',
            password: 'password',
            favorites: [],
        }).save();
        mockData['user2'] = await new User({
            email: 'test2@test.com',
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
        mockData['transaction1'] = await new Product({
            product1: mockData['product1'],
            product2: mockData['product2'],
            user1: mockData['product1'].owner,
            user2: mockData['product2'].owner,
        }).save();

        agent = chai.request.agent(app);
        await agent.post('/login').send({
            email: 'test1@test.com',
            password: 'password',
        }).then(() => console.log("logged in"));
    });

    describe('Transaction Controller', function () {
        it('Get transactions', function () {
            agent
                .get('/transaction')
                .send()
                .end((err, res) => {
                    console.log(res)
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    expect(res.body).to.be.an('array');
                });
        });

        // it('Post a transaction', function (done) {
        //     agent
        //         .post('/transaction')
        //         .send({
        //             productId1: mockData['product1']._id.toString(),
        //             productId2: mockData['product3']._id.toString(),
        //         })
        //         .end((err, res) => {
        //             expect(res).to.have.status(201);
        //             expect(err).to.be.null;
        //             expect(res.body.message).to.equal(
        //                 'Transaction created successfully'
        //             );
        //             expect(res.body.redirect).to.not.be.empty;

        //             mockData['transaction2'] = Transaction.findById(
        //                 res.body.data._id
        //             );
        //         });
        // });

        // it('Post an existing transaction', function (done) {
        //     agent
        //         .post('/transaction')
        //         .send({
        //             productId1:
        //                 mockData['transaction1']['product1']._id.toString(),
        //             productId2:
        //                 mockData['transaction1']['product2']._id.toString(),
        //         })
        //         .end((err, res) => {
        //             expect(res).to.have.status(200); // No new transaction is created
        //             expect(err).to.be.null;
        //             expect(res.body.redirect).to.not.be.empty;
        //         });
        // });

        // it('Update a transaction', async function () {
        //     agent
        //         .put(`/transaction/${mockData['transaction1']._id}`)
        //         .send({
        //             rating1: 5,
        //             review1: 'transaction went smoothly',
        //         })
        //         .end((err, res) => {
        //             expect(res).to.have.status(200);
        //             expect(err).to.be.null;
        //             expect(res.body).to.not.be.empty;
        //         });
        // });

        // it('Delete a transaction', async function () {
        //     agent
        //         .delete(`/transaction/${mockData['transaction1']._id}`)
        //         .end((err, res) => {
        //             console.log(err)
        //             expect(res).to.have.status(200);
        //             expect(err).to.be.null;
        //             expect(res.body.deleteCount).to.equal(1);
        //         });
        // });
    });


    afterEach(async function () {
        console.log("after hook")
        await User.deleteMany({ _id: { $in: [mockData.user1._id, mockData.user2._id] } });
        await Product.deleteMany({ _id: { $in: [mockData.product1._id, mockData.product2._id, mockData.product3._id] } });
        await Transaction.deleteMany({ _id: { $in: [mockData.transaction1._id] } });
        await agent.close();
    });
});
