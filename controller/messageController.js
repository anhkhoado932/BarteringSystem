const messageController = require('../models/message');

exports.getMessages = (req, res) => {
    const { page } = req.params.page || 0;
    const limit = 10;
    const offset = limit * page;
    const transactionId = req.params.transactionId;
    if (!transactionId) {
        return res
            .status(400)
            .send({ message: 'Please provide transaction id' });
    }

    messageController
        .find({ transactionId })
        .sort('-createdAt')
        .skip(offset)
        .limit(limit)
        .then((messages) => {
            console.log(messages);
            messages.reverse();
            res.status(200).send(messages);
        })
        .catch((err) => {
            return res.status(400).send({ message: err });
        });
};
