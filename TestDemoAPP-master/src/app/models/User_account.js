const mongoose = require('mongoose');

const User_account = new mongoose.Schema({
    username: {type: String, unique:true, require: true},
    password: {type: String},
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    address: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model('User', User_account, 'User');