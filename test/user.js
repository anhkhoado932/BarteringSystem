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
});
