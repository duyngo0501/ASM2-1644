const mongoose = require('mongoose');

const Catalog = new mongoose.Schema({
    name: {type: String, required: true, unique: true}
}, {
    timestamps: true
});

module.exports = mongoose.model('Catalog', Catalog, 'Catalog');