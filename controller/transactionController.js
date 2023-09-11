const ObjectId = require('mongodb').ObjectId;
const productModel = require('../models/product');
const transactionModel = require('../models/transaction');

exports.getTransaction = (req, res) => {
    const { _id } = req.session.user;
    transactionModel
        .find({
            $or: [{ userId1: _id }, { userId2: _id }],
        })
        .then((transaction) => {
            res.status(200).send(transaction);
        })
        .catch((err) => {
            res.status(400).send({ message: err });
        });
};

exports.insertTransaction = async (req, res) => {
    const productId1 = new ObjectId(req.body['productId1']);
    const productId2 = new ObjectId(req.body['productId2']);
    const product1 = await productModel.findById(productId1);
    const product2 = await productModel.findById(productId2);
    const newTransaction = new transactionModel({
        userId1: product1.owner,
        userId2: product2.owner,
        product1: [productId1],
        product2: [productId2],
        status: 'active',
    });
    newTransaction
        .save()
        .then((transaction) => {
            res.status(201).send({
                message: 'Transaction created successfully',
                data: transaction,
            });
        })
        .catch((err) => {
            res.status(400).send({ message: err });
        });
};
