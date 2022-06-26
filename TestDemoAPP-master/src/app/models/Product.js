const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);


const Product = new mongoose.Schema({
    catalogid: {type:String, required: true},
    productname: {type: String},
    price: {type: Number},
    content: {type: String},
    image_link: {type: String},
    view: {type: Number},
    slug: {type: String, slug: 'productname'}
},{
    timestamps: true
});

module.exports = mongoose.model('Products', Product, 'Products');