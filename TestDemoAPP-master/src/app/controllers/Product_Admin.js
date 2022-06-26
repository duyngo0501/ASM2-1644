const { multipleMongooseToObject, moongoseToObject } = require('../../utility/mongoose');
const Admin_products = require('../models/Product');
const Catalogs = require('../models/Catalog');
const md5 = require('../../utility/md5');
const cookieParser = require('cookie-parser');


class Product_Admin {

    // [get] /admin/products
    show(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Catalogs.find({})
            .then(Catalogs => {
                Catalogs = multipleMongooseToObject(Catalogs);
                Admin_products.find({})
                    .then(products => {
                        products = multipleMongooseToObject(products)


                        Catalogs.forEach(function(part, indexer) {

                            products.forEach(function(part, index) {
                               
                                if(Catalogs[indexer]._id == products[index].catalogid) {
                                    products[index].catalogid = Catalogs[indexer].name;
                                }
                            });
                        });
                        
                        res.render('product/product', {
                            layout: 'admin',
                            title: 'Products',
                            username: req.cookies.username,
                            products
                        })
                    })
                    .catch(next);
            })
            .catch(next);
    }


    // [get] admin/products/:id/delete
    delete(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Admin_products.deleteOne({
            _id: req.params.id
          })
          .then(() => {
            res.redirect('/admin/products');
          })
          .catch(next);
    }

    // [get] admin/products/add
    add(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Catalogs.find({})
            .then(catalogs => {
                res.render('product/addproduct',  {
                    layout: 'admin',
                    title: 'Add new product',
                    catalogs: multipleMongooseToObject(catalogs),
                    username: req.cookies.username
                })
            })
            .catch(next);
    }

    // [post] admin/products/save
    save(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        
        const data = req.body;
        delete data.image;
        delete data.files;
        delete data.Confirm;

        data.view = 0;
        const Admin_product = new Admin_products(data)
        Admin_product.save()
          .then(() => {
            res.redirect('/admin/products');
          })
          .catch(next);
    }

    // [get] admin/products/:id/edit
    edit(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        Catalogs.find({})
            .then(catalogs => {
                catalogs = multipleMongooseToObject(catalogs)
                Admin_products.findOne({
                    _id: req.params.id
                })
                    .then(product => {
                        product = moongoseToObject(product);
                        res.render('product/edit', {
                            layout: 'admin',
                            title: 'Edit product',
                            username: req.cookies.username,
                            product,
                            catalogs
                        })
                    })
                    .catch(next);
            })
            .catch(next);
    }

    // [post] admin/products/:id/update
    update(req, res, next) {
        if(typeof req.cookies.username == 'undefined') {
            res.redirect('/admin');
          };
        
        const data = req.body;
        delete data.image;
        delete data.files;
        delete data.Confirm;
        
        Admin_products.updateOne({
            _id: req.params.id
        }, data)
            .then(() => {
                res.redirect('/admin/products');
            })
            .catch(next);
    }

    searchforProducts(req, res, next) {
        Catalogs.find({})
            .then(Catalogs => {
                Catalogs = multipleMongooseToObject(Catalogs);
                Admin_products.find({
                    productname: {$regex: req.body.search, $options: 'i'}
                })
                    .then(products => {
                        products = multipleMongooseToObject(products)


                        Catalogs.forEach(function(part, indexer) {

                            products.forEach(function(part, index) {
                               
                                if(Catalogs[indexer]._id == products[index].catalogid) {
                                    products[index].catalogid = Catalogs[indexer].name;
                                }
                            });
                        });
                        
                        res.render('product/product', {
                            layout: 'admin',
                            title: 'Products',
                            username: req.cookies.username,
                            products
                        })
                    })
                    .catch(next);
            })
            .catch(next);
    }

}

module.exports = new Product_Admin;