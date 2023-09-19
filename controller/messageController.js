const messageController = require('../models/message');

exports.getMessages = (req, res) => {
    const { _id } = req.session.user;
    const transactionId = req.params.transactionId;
    if (!transactionId) {
        return res
            .status(400)
            .send({ message: "Please provide transaction id" });
    }

    messageController
        .find({ transactionId })
        .sort("-createdAt")
        .lean()
        .then((messages) => {
            messages.reverse();
            messages.forEach((message) => {
                message.from_me = _id == message.userId;
            });
            res.status(200).send(messages);
        })
        .catch((err) => {
            return res.status(400).send({ message: err });
        });
};
