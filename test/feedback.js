const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server');
const Feedback = require('../models/feedback');

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
});
