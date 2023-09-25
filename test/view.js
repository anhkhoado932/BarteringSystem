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
