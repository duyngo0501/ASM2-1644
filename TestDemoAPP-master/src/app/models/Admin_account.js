const mongoose = require('mongoose');

const Admin_account = new mongoose.Schema({
    username: {type: String, unique:true, require: true},
    status: {type: Number},
    password: {type: String},
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', Admin_account, 'Admin');