const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
    user: {type:Object},
    payment_info: {type: String},
    total: {type: Number},
    Products: {type: Array}
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', Transaction, 'Transaction');