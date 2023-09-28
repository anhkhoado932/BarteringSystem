const ObjectId = require('mongodb').ObjectId;
const productModel = require('../models/product');
const transactionModel = require('../models/transaction');

exports.getTransaction = (req, res) => {
    const user = req.session.user;
    const { _id } = user;
    transactionModel
        .find({
            $or: [{ user1: _id }, { user2: _id }],
        })
        .populate('user1', 'name email')
        .populate('user2', 'name email')
        .populate('product1', 'name imageUrl price')
        .populate('product2', 'name imageUrl price')
        .lean()
        .then((transactions) => {
            transactions.sort(compareTransactionByStatus);
            const selectedId = req.query.transactionId ?? null;
            req.session.selectedTransactionId = selectedId;
            const selectedTransaction = transactions.find(
                (e) => e._id.toString() == selectedId
            );
            if (selectedTransaction) {
                selectedTransaction['isUser1'] =
                    selectedTransaction['user1']._id == _id;
            }
            res.render('transaction', {
                transactions,
                user,
                selectedTransaction,
            });
        })
        .catch((err) => {
            res.status(500).send({ message: err });
        });
};

exports.insertTransaction = async (req, res) => {
    try {
        // Find product1 and product2
        const productId1 = new ObjectId(req.body['productId1']);
        const productId2 = new ObjectId(req.body['productId2']);
        const [product1, product2] = await Promise.all([
            productModel.findById(productId1),
            productModel.findById(productId2)
        ]);
        if (!product1 || !product2) {
            return res.status(404).send({ message: 'One or both products not found' });
        }

        // Create new transaction
        const newTransaction = new transactionModel({
            product1,
            product2,
            user1: product1.owner,
            user2: product2.owner,
            status: 'active',
        });
        
        await newTransaction.save();
        res.status(201).send({
            message: 'Transaction created successfully',
            data: newTransaction,
            redirect: `/transaction?transactionId=${newTransaction._id.toString()}`,
        });
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
    
};

exports.updateTransaction = async (req, res) => {
    const transactionId = req.params.id;
    const updateTransaction = req.body;
    try {
        const transaction = await transactionModel.findByIdAndUpdate(
            transactionId,
            updateTransaction,
            { new: true }
        );
        res.status(200).send(transaction);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};

exports.deleteTransaction = (req, res) => {
    const transactionId = new ObjectId(req.params.id);
    transactionModel
        .deleteOne({ _id: transactionId })
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(500).send('Internal Server Error');
        });
};

exports.finishTransaction = async (req, res) => {
    const { _id } = req.session.user;
    const { transactionId } = req.body;

    try {
        const currentTransaction =
            await transactionModel.findById(transactionId);
        const isUser1 = currentTransaction.user1._id == _id;

        if (currentTransaction.status.startsWith('pending')) {
            currentTransaction.status = 'finished';
        } else if (currentTransaction.status == 'active') {
            currentTransaction.status = isUser1
                ? 'pending_user2'
                : 'pending_user1';
        }
        await currentTransaction.save();

        res.status(200).send({"message": "transaction status is updated"});

        // Cancel all transactions involving the same products if this transaction is finished
        if (currentTransaction.status == 'finished') {
            const transactedProductIds = [
                currentTransaction.product1,
                currentTransaction.product2,
            ];

            // Update other transactions involving the same products to "interrupted"
            await transactionModel.updateMany(
                {
                    $or: [
                        { product1: { $in: transactedProductIds } },
                        { product2: { $in: transactedProductIds } },
                    ],
                    _id: { $ne: currentTransaction._id },
                },
                {
                    status: 'interrupted',
                }
            );
        }
    } catch (err) {
        res.status(500).json({
            error: 'Failed to finish the transaction',
            message: err.message,
        });
    }
};

exports.cancelTransaction = async (req, res) => {
    try {
        const { transactionId } = req.body;

        await transactionModel.findByIdAndUpdate(transactionId, {
            status: 'interrupted',
        });

        res.status(200).send({"message": "transaction status is updated"});
    } catch (err) {
        res.status(500).json({
            error: 'Failed to cancel the transaction',
            message: err.message,
        });
    }
};

function compareTransactionByStatus(transaction1, transaction2) {
    // TODO: create TransactionStatus schema in the future
    const statusEnum = {
        active: 0,
        pending: 1,
        finished: 2,
        interrupted: 3,
    };

    const status1 = transaction1.status;
    const status2 = transaction2.status;
    if (!(status1 in statusEnum) || !(status2 in statusEnum)) {
        return -1;
    }
    return statusEnum[status1] < statusEnum[status2];
}
